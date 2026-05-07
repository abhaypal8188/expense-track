import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 200
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
