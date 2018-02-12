const express = require('express');
const router = express.Router();
const co = require('co');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Classify = require('../../define/Classify');
const Product = require("../../define/Product");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('back/shops', {title: '商品列表'});
});

// 获得数据
router.post('/', function (req, res) {
    const countPerPage = 15;
    co(function* () {
        const products = yield Product.findAndCountAll({
            'limit': countPerPage,                      // 每页多少条
            'offset': countPerPage * (req.body.page - 1),  // 跳过多少条
            'include': [Classify],
            where: {
                name: {
                    [Op.like]: '%' + req.body.keyword + '%'
                }
            }
        });
        res.status(200).json({code: 0, msg: "", count: Math.ceil((products.count) / countPerPage), data: products.rows})
    }).catch(function (e) {
        console.log(e)
    });
});

// 获得分店数据
router.post('/getBusinessInfor', function (req, res) {
    co(function* () {
        const classify = yield Classify.findById(req.body.id);
        const businessArray = yield classify.getBusinessInfors({
            attributes: ['id', 'name']
        });
        res.status(200).json({code: 0, msg: "获取成功", data: businessArray})
    }).catch(function (e) {
        console.log(e)
    });
});

// 添加数据
router.post('/add', function (req, res) {
    co(function* () {
        const classify = yield Classify.findById(req.body.claId);
        const product = yield Product.create({
            'name': req.body.name,
            'price': req.body.price,
            'con': req.body.con,
            'stock': req.body.stock
        });
        classify.addProduct(product);
        res.status(200).json({code: 200, msg: "添加成功", data: product})
    }).catch(function (e) {
        console.log(e);
    });
});

// 删除数据
router.post('/delete', function (req, res) {
    Product.destroy({'where': {'id': req.body.id}});
    res.status(200).json({code: 200, msg: "删除成功"})
});

module.exports = router;