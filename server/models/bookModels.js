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

    price: {
        type: Number,
        required: true,
        trim: true,
        message: 'Price field is required',
        
    },
    imageUrl: {
        type: String,
        required: true,
        message: 'Image URL is required',
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    unlikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);