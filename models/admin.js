const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type:String, required:true},
    email: { 
        type: String, 
        unique: true,
        required: 'Email address cannot be left blank',
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required:  [true,  'Password cannot be left blank'],
    },
    createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);