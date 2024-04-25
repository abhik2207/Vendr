const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title: { type: String, required: [true, 'Title of the product is required'], unique: true },
    brand: { type: String, required: [true, 'Brand of the product is required'] },
    category: { type: String, required: [true, 'Category of the product is required'] },
    description: { type: String, required: true },
    price: { type: Number, min: [0, 'Price cannot be less than 0'], required: [true, 'Price of the product is required'], max: [100000, 'Price cannot be greater than 1 Lakh'] },
    discountPercentage: { type: Number, min: 0, max: 90 },
    rating: { type: Number, min: [0, 'Rating cannot be less than 0'], max: [5, 'Rating cannot be greater than 5'], default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    thumbnail: { type: String, required: [true, 'Provide a thumbnail of the product'] },
    images: [String],
    deleted: {type: Boolean, default: false}
});

const virtual = productSchema.virtual('id');
virtual.get(function(){
    return this._id;
});
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
})

const ProductModel = mongoose.model('Product', productSchema);
exports.Product = ProductModel;