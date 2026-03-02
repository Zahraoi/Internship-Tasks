const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  available: {
    type: Number,
    default: 1,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
