const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLenght: 64,
    },
    description: {
        type: String,
        required: true,
        minLength: 16,
        maxLength: 240,
    },
    img_url: {
        type: String,
        maxLenght: 240,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category'}],
});

// Virtual for product's url
ProductSchema.virtual('url').get(function() {
    return `/products/${this._id}`;
});

module.exports = mongoose.model('Product', ProductSchema);