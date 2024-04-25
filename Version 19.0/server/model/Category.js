const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    value: { type: String, required: [true, 'Provide value of category'], unique: true },
    label: { type: String, required: [true, 'Provide label of category'], unique: true },
});

const virtual = categorySchema.virtual('id');
virtual.get(function(){
    return this._id;
});
categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
})

const CategoryModel = mongoose.model('Category', categorySchema);
exports.Category = CategoryModel;