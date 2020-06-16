const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const app = express()
const multer = require('multer')
const path = require('path')
const fs = require("fs")
const Brand = require('../models/brand');
const Category = require('../models/category');
var data1 = new Date()
var date = data1.getDate()
var month = data1.getMonth()
var month1 = month + 1
var year = data1.getFullYear()
var today = date + '-' + month1 + '-' + year
const timestamp = Math.floor(Date.now())

try {

 
  if (fs.existsSync('./upload/' + today)) {
    console.log("Directory exists.")
  }
  else {
   
    fs.mkdirSync('./upload/' + today);
  }
}
catch (e) {
  console.log(e)
}
const storage = multer.diskStorage(
  {
    destination: function (req, file, cb) {

      cb(null, './upload/' + today)

    },

    filename: function (req, file, cb) {
      var extensionName = file.originalname.split('.')
      cb(null, 'categoryimage' + '_' + timestamp + '_'  + path.extname(file.originalname))
    }

  })

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {

    cb(null, true);

  }
  else {

    cb(null, false);
  }
};

const upload = multer(
  {

    storage,
    limits:
    {
      fileSize: 1024 * 1024 * 50
    },
    fileFilter

  })
//show all category 
router.get('/getcategory', async(req, res, next) => {

    Category.find({})
     .populate('brand')
        
    .exec()
    .then(data => {
        res.status(201).json({
          data:data,
          status:"success",
          message:"category details found"
        });
    })
    .catch(er => {
        res.status(500).json({
            data: er,
            status:"failed",
            message:"Internal server error"
        })
    })
});

//post category...

router.post('/addcategory',upload.single("categoryimage"),authenticate, (req, res, next) => {
  console.log(req.file.path)
 
  
 
    const category = new Category({
        
        name: req.body.name,
        brand: req.body.brand,
        description: req.body.description,
        categoryimage: req.file.path
    });
    
    category.save()
    .then(data => {
        res.status(201).json({
          status:"success",
              message:" added category successfully",
              data:data
            
        });
    })
    .catch(er => {
        res.status(500).json({
          status:"failed",
          message:"internal server error",
            error: er
        })
    });

});
//update category....

router.put('/UpdateCategory/:id',authenticate, async (req, res) => {
  try {
    console.log(req.params.name)
    const reqBody = Object.keys(req.body)
    console.log(reqBody)
    const updates = {}
    for (let index = 0; index < reqBody.length; index++) {
      updates[reqBody[index]] = Object.values(req.body)[index]
    }
    console.log(updates)
    const updateCategory = await Category.updateOne({ _id: req.params.id }, { $set: updates }, function (err, result) {
      if (err) {
        res.status(500).send(err)
      }
      else {
        res.status(200).send({
          message: "Updates the category!!!",
          result
        })
      }
    })

  } catch (e) {
    res.status(500).send({
      message: "Internal server error!!!",
      e
    })
  }
})

//Delete category
router.delete('/DeleteCategory/:id',authenticate,async(req,res)=>
{
    
    try{
        const deleteCategory=await Category.findByIdAndDelete({_id:req.params.id})
        res.status(200).send({
          
          status:"success",
            message:"Delete Successfully from Category!!!",
            deleteCategory
        })
    }catch(e)
    {
        res.status(500).send({
          status:"failed",
            message:"Internal Server Error!!",
            e
        })
    }
})

//cat..
router.get('/SearchProduct/:name', (req, res, next) => {

  const name = req.params.name;
  
  Category.findOne({name: name}).populate('product')

  .exec()

  .then(product => {

      if(product){
          res.status(200).json({
              message: product
          });
      }else{
          return res.status(404).json({
              message: 'Not Found'
          })
      }
  })
  .catch(err => {
      res.status(500).json({
          error: err
      });
  });


});


module.exports = router

