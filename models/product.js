const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
 
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    specification:{type: String},
    image: 
        [{
            type: String,
            required:true
        }
        ],

    category:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true  },
    createdAt:  { type: Date, default: Date.now },
    stock: { type: String, required:true }
    //createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    //updatedAt: Date,
    //updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});







module.exports = mongoose.model('Product', productSchema);