const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Brand = require('../models/brand');
const authenticate = require('../middleware/authenticate');

// post brand name
router.post('/addbrand', authenticate,async(req,res)=>{
    const brand = new Brand({
        
      name: req.body.name,
      
  });

  brand.save()
  .then(doc => {
      res.status(201).json({
        
          brand: doc,
          status:"success",
          message:"successfully added brand"
      });
  })
  .catch(er => {
      res.status(500).json({
          error: er,
          status:"failed",
          message:"Internal server error"
      })
  });

})

//see all brands

router.get('/showbrand',async(req,res)=>{
    try {
        const data = await Brand.find({})
    
          .exec(function (err, data) {
            if (err) {
              res.status(500).send(
                {
                  data:err,
                  status:"failed",
                  message: "internal server error"
                }
              )
    
            }
            else {
              res.status(200).send({
               
              data:data,
              status:"success",
              message:"brand details found"
              })
            }
          })
    
    
    
      } catch (e) {
        res.status(500).send({
          message: "Internal Server Error",
          e
        })
      }
    })

router.put('/upadatebrand/:id',authenticate,async(req,res)=>
{
    const reqBody=Object.keys(req.body)
    console.log(reqBody)
    const updates={}
    for(let index=0;index<reqBody.length;index++)
    {
        updates[reqBody[index]]=Object.values(req.body)[index]
    }
    try{
        const updateBrand=await Brand.updateOne({_id:req.params.id},{$set:updates})
        res.status(200).send({
          status:"success",
            message:"Updates the Brand!!!",
            updateBrand
        })
    }catch(e)
    {
        res.status(500).send({
          status:"failed",
            message:"internal server error!!",
            e
        })
    }
})


//delete the Brand....................

router.delete('/DeleteBrand/:id',authenticate,async(req,res)=>
{
    
    try{
        const deleteBrand=await Brand.find({_id:req.params.id}).remove()
        res.status(200).send({
            message:"Delete Successfully from BrandCollection!!!",
            deleteBrand
        })
    }catch(e)
    {
        res.status(500).send({
            message:"Internal Server Error!!",e
        })
    }
})



module.exports = router;



