const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        message: 'Name field is required'
    },
    description: {
        type: String,
        required: true,
        trim: true,
        message: 'Description field is required',
        
    },
    author: {
        type: String,
        required: true,
        trim: true,
        message: 'Author field is required',
        
    },
    published_by: {
        type: String,
        required: true,
        trim: true,
        message: 'Publisher field is required',
        
    },
   rating: {
        type: Number,
        required: true,
        trim: true,
        message: 'Rating field is required',
        
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        message: 'Price field is required',
        
    },

    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);