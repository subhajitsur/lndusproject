const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    brand: [{   type:mongoose.Schema.Types.ObjectId,
         ref: 'Brand', required: true  }],
    name: { type: String, required: true,unique:true },
    createdAt:  { type: Date, default: Date.now },
   // brand:[{type:mongoose.Schema.ObjectId,Ref:'Brand',required:'true'}],
    categoryimage:{type: String, required:true},
    description: { type: String }
   
});


module.exports = mongoose.model('Category', categorySchema);