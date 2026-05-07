import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Category from '../models/Category.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const defaultCategories = [
  { name: 'Salary', type: 'income', isDefault: true },
  { name: 'Freelance', type: 'income', isDefault: true },
  { name: 'Food', type: 'expense', isDefault: true },
  { name: 'Rent', type: 'expense', isDefault: true },
  { name: 'Travel', type: 'expense', isDefault: true },
  { name: 'Shopping', type: 'expense', isDefault: true },
  { name: 'Bills', type: 'expense', isDefault: true },
];

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Not all fields have been entered.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'The password needs to be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    // Init categories if there are none (on a global level, or we just rely on default flags)
    const catCount = await Category.countDocuments({ isDefault: true });
    if (catCount === 0) {
      await Category.insertMany(defaultCategories);
    }

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Not all fields have been entered.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account with this email has been registered.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
