const mongoose = require('mongoose');
const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt:{ type: Date, default: Date.now }
})


module.exports = mongoose.model('Brand', brandSchema);
    