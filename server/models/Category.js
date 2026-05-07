import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.isDefault; // User is required only if it's not a default category
    }
  }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
