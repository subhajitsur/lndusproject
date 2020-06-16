const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const app = express();
const multer = require('multer');
const path = require('path');
const Category = require('../models/category');
const Brand = require('../models/brand');
const storage = multer.diskStorage({
    destination: 'upload',
    filename: (req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
    
})
app.use('/image',express.static('upload'))
const Product = require('../models/product');

//insert product......
router.post('/create' ,upload.array('image'),authenticate,(req, res, next) => {
let imageArr = [];

if(req.files.length) {
    req.files.forEach((filePath,index)=>{
        if(filePath)
        {
            imageArr.push(filePath['path']);
        }
        
    })
   
}
else{
    res.send("upload the file")
        }
    const product = new Product({
        
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: imageArr,
        specification:req.body.specification,
        brand:req.body.brand,
        category:req.body.category,
        stock:req.body.stock
        //createdBy: req.body.createdBy
    });
    console.log("IMAGE  ARRAY:",imageArr)
    product.save()
    .then(data => {
        res.status(201).json({
            status:"success",
            message: "successfully added product",
            data:data
        });
    })
    .catch(er => {
        res.status(500).json({
            status:"failed",
            message:"internal server error",
            data: er
        });
    })

});
//show all product.......
router.get('/showproduct', (req, res, next) => {

    Product.find({})
    .exec()
    .then(data => {
        res.status(200).json({
            status:"sucess",
            message: " all product found ",
            data:data,
            
        });
    })
    .catch(er => {
        res.status(500).json({
            status:"failed",
            message:"internal server error",
            error: er
        });
    })

});

//show all products with brand & category
router.get('/viewallproduct', (req, res, next) => {

    Product.find({}).populate('category').populate('brand')
        
   
    .exec()
    .then(data => {
        res.status(200).json({
            status:"sucess",
            message: " all products found ",
            data:data,
            
        });
    })
    .catch(er => {
        res.status(500).json({
            status:"failed",
            message:"internal server error",
            error: er
        });
    })

});


//search product with name
router.get('/Search/Product/:name', async (req, res) => {
    try {
      const proName = req.params.name
      const name = RegExp('.*' + proName + '.*', 'i')
      const product = await Product.find({ name: name })
      if (product == 0) {
        res.status(404).send({

          status:"Failed",
          message: "This product not found"
        })
  
      }
      else {
        res.status(200).send({
            status:"success",
          message: "products are",
            data: product
        })
      }
  
    } catch (e) {
      res.status(500).send({
          status:"failed",
        message: "Internal server aerror!!",
        e
      })
    }
  })
  
  //delete product....
  router.delete('/DeleteProduct/:id',authenticate,async(req,res)=>
  {
      
      try{
          const deleteProduct=await Product.findByIdAndDelete({_id:req.params.id})
          res.status(200).send({
            
            status:"success",
              message:"Delete Successfully from product",
              data:deleteProduct
          })
      }catch(e)
      {
          res.status(500).send({
            status:"failed",
              message:"Internal Server Error!!",
             data: e
          })
      }
  })

//update product without image......

router.put('/UpdateProduct/:id', authenticate,async (req, res) => {
  try {
    console.log(req.params.name)

    const reqBody = Object.keys(req.body)

    console.log(reqBody)

    const updates = {}

    for (let index = 0; index < reqBody.length; index++) {
      updates[reqBody[index]] = Object.values(req.body)[index]
    }
    console.log(updates)

    const updateProduct = await Product.updateOne({ _id: req.params.id }, { $set: updates }, function (err, result) {
      if (err) {

        res.status(500).send(err)
      }
      else {

        res.status(200).send({

            status:"success",
            message: "Updates the product.",
            data: result
        })
      }
    })

  } catch (e) {

    res.status(500).send({

      status:"failed",
      message: "Internal server error!!!",
      e
    })
  }
})

//product search with brand name.....
router.get('/SearchBrandName/:name', async (req, res) => {
  try {
    const brand = req.params.name
    const name= RegExp(brand, 'i')


    const product = await Brand.find({ name: name })
      .populate('product')
      .exec(function (err, productData) {
        if (err) {
          res.status(500).send({
            message: "internal server error",
            e
          })
        }
        else {
          if (productData == 0) {
            res.status(500).send({
              message: "Does Not Match The data From Database"

            })
          }
          else {
            res.status(200).send({
              message: "Successfully Serach The product From Database ",
              productData
            })
          }
        }
      })


  } catch (e) {
    res.status(500).send({
      message: "Internal server error", e
    })
  }
})

//search by productrange high to low..

router.get('/product/Sort/High_to_low', async (req, res) => {

  try {
    const product = await Product.find({}).sort({ price: -1 })

    res.status(200).send({

      status:"success",
      message: "All products are",
      data: product

    })
  } catch (e) {

    res.status(500).send({

      status:"failed",
      message: "internal server Error",
      data: e

    })
  }
})


//user can sort the product name ......... A to z

router.get('/product/Sort/ProductName/AtoZ', async (req, res) => {
  try {
    const product = await Product.find({}).sort({ name: 1 })
    res.status(200).send({
      status:"success",
      message: "All products are",
      data: product
    })
  } catch (e) {
    res.status(500).send({
      status:"failed",
      message: "internal server Error!!",
      data: e
    })
  }
})














module.exports = router












