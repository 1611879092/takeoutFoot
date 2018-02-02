const express = require('express');
const router = express.Router();
const co = require('co');
const Classify = require('../../define/Classify');
const Product = require("../../define/Product");
const Unit = require('../../define/Unit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('back/shops', { title: '商品列表' });
});

// 获得数据
router.post('/',function (req, res) {
    co(function* () {
        const products = yield Product.findAndCountAll({
            'include':[Classify]
        });
        res.status(200).json({code:0,msg:"",count:products.count,data:products.rows})
    }).catch(function (e) {
        console.log(e)
    });
});

// 添加数据
router.post('/add',function (req, res) {
    if(req.body.id == ''){
        co(function* () {
            const classify = yield Classify.findById(req.body.claId);
            const unit = yield Unit.findById(req.body.unitID);
            const product = yield Product.create({'name': req.body.name,'price':req.body.price,'con':req.body.con,'img':req.body.img,'stock':req.body.stock});
            classify.addProduct(product);
            product.setUnit(unit);
            res.status(200).json({code:200,msg:"添加成功"})
        }).catch(function (e) {
            console.log(e);
        });
    }else {

    }
});

// 删除数据
router.post('/delete',function (req, res) {
    Product.destroy({'where':{'id':req.body.id}});
    res.status(200).json({code:200,msg:"删除成功"})
});

module.exports = router;