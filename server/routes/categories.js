import express from 'express';
import Category from '../models/Category.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all categories (default + user-specific)
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ isDefault: true }, { user: req.user }]
    }).sort({ name: 1 });
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create custom category
router.post('/', auth, async (req, res) => {
  try {
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const newCategory = new Category({
      name,
      type,
      user: req.user,
      isDefault: false
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete custom category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user });
    if (!category) {
      return res.status(404).json({ message: 'Category not found or unauthorized' });
    }
    
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
