const express = require('express')
const mongoose = require('mongoose')
//const path=require('path')
const bodyParser = require('body-parser')
const authenticate = require('./middleware/authenticate');
// const cors = require('cors');
var logger = require('morgan');

const brandRoutes = require('./router/brands');
const categoryRoutes = require('./router/categories')
const productRoutes = require('./router/products')
const adminRoutes= require('./router/admins');
 //require('./upload');

const app = express()
const port = process.env.PORT || 7000
mongoose.connect('mongodb://localhost/shoppingcarttt-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
    
}).then(()=>{
    console.log("Connected.....");
}).catch(()=>{
    console.log("not connected...");
});
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(logger('dev'));
app.use(express.json())
app.use(bodyParser.json())
app.use(brandRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(adminRoutes);
//app.use(express.static('upload'))
app.use('/upload/',express.static('upload'))

//app.use(upload);
//require('./Database_Project/database')
var cors = require('cors');
app.use(cors({
  'Origin':'http://localhost:4200'
}));


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
