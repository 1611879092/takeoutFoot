const express = require('express');
const router = express.Router();
const co = require('co');
var Sequelize = require("sequelize");
const Classify = require('../../define/Classify');
const BusinessInfor = require('../../define/BusinessInfor');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('back/menus', { title: '' });
});

router.post('/',function (req, res) {
    co(function* () {
        const classify = yield Classify.findAndCountAll({
            include:[{
                model:BusinessInfor,
                attributes: ['name'],
                required: true
            }],
            distinct: true
        });
        res.status(200).json({code:0,msg:"获取成功",data:classify.rows})
    }).catch(function (e) {
        console.log(e)
    });
});

router.post('/add',function (req, res) {
    co(function* () {
        const findClassify = yield Classify.findOne({
            where:[{
                name:req.body.name
            }]
        });
        if(findClassify == null){
            const cs = yield Classify.create({'name':req.body.name});
            req.body.BusinessInforId.substr(1).split(',').forEach(value => {
                co(function* () {
                    var bs = yield BusinessInfor.findById(value);
                    yield cs.addBusinessInfor(bs);
                }).catch(function (e) {
                    console.log(e)
                });
            });
            res.status(200).json({code:200,msg:"添加成功"})
        }else {
            res.status(200).json({code:300,msg:"分类已存在"})
        }
    }).catch(function (e) {
        console.log(e);
    });
});

router.post('/delete',function (req, res) {
    Classify.destroy({'where':{'id':req.body.id}});
    res.status(200).json({code:200,msg:"删除成功"})
});

module.exports = router;