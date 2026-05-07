import express from 'express';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get dashboard summary (Total balance, income, expense, and recent transactions)
router.get('/summary', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user }).sort({ date: -1 });
    
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(tx => {
      if (tx.type === 'income') totalIncome += tx.amount;
      if (tx.type === 'expense') totalExpense += tx.amount;
    });

    const balance = totalIncome - totalExpense;
    
    const recentTransactions = await Transaction.find({ user: req.user })
      .populate('category', 'name type')
      .sort({ date: -1 })
      .limit(5);

    res.json({
      balance,
      totalIncome,
      totalExpense,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get data for pie chart (expenses by category)
router.get('/category-expenses', auth, async (req, res) => {
  try {
    const expensesByCategory = await Transaction.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(req.user), 
          type: 'expense' 
        } 
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
        $unwind: '$categoryDetails'
      },
      {
        $project: {
          name: '$categoryDetails.name',
          value: '$totalAmount',
          _id: 0
        }
      }
    ]);

    res.json(expensesByCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get data for bar chart (last 6 months income vs expense)
router.get('/monthly', auth, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user),
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const formattedData = monthlyData.map(item => {
      const date = new Date(item._id.year, item._id.month - 1);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: item._id.year,
        income: item.income,
        expense: item.expense
      };
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
