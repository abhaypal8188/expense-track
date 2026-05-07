import express from 'express';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all transactions for user (with pagination and filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user };
    
    if (type) query.type = type;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .populate('category', 'name type icon')
      .sort({ date: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add transaction
router.post('/', auth, async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: 'Please provide amount, type, and category' });
    }

    const newTransaction = new Transaction({
      user: req.user,
      amount,
      type,
      category,
      date: date ? new Date(date) : Date.now(),
      notes
    });

    const savedTransaction = await newTransaction.save();
    const populatedTx = await savedTransaction.populate('category', 'name type');
    
    res.status(201).json(populatedTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    let transaction = await Transaction.findOne({ _id: req.params.id, user: req.user });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.date = date ? new Date(date) : transaction.date;
    transaction.notes = notes !== undefined ? notes : transaction.notes;

    const updatedTransaction = await transaction.save();
    const populatedTx = await updatedTransaction.populate('category', 'name type');
    
    res.json(populatedTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
