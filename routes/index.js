const express = require('express');
const router = express.Router();
const co = require('co');
const Classify = require('../define/Classify');
const Product = require("../define/Product");
const Unit = require('../define/Unit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});

router.post('/products', function(req, res, next) {
  co(function* () {
      const products = yield Classify.findAll({
          'include':[{
              model:Product
          }]
      });
      /*const products = yield Product.findAll({
          'include':[Unit]
      });*/
      res.status(200).json({code:0,msg:"",data:products})
  }).catch(function (e) {
      console.log(e)
  })
});

module.exports = router;