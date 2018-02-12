const express = require('express');
const router = express.Router();
const co = require('co');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Classify = require('../../define/Classify');
const BusinessInfor = require('../../define/BusinessInfor');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('back/menus', { title: '' });
});
// 获取分类数据
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
// 筛选分类
router.post('/filter',function (req, res) {
    console.log(req.body);
    co(function* () {
        const classify = yield Classify.findAndCountAll({
            include:[{
                model:BusinessInfor,
                attributes: ['name'],
                required: true,
                where:[{
                    'id':req.body.BusinessInforId
                }]
            }],
            distinct: true,
            where:[{
                'name':{
                    [Op.like]: '%' + req.body.name + '%'
                }
            }]
        });
        res.status(200).json({code:0,msg:"获取成功",data:classify.rows})
    }).catch(function (e) {
        console.log(e)
    });
});
// 添加分类
router.post('/add',function (req, res) {
    /*if(!req.body.BusinessInforId || req.body.BusinessInforId.trim() == '' ){
        res.status(200).json({code:300,msg:"请选择分店"});
        return false;
    }else if(!req.body.name || req.body.name.trim() == ''){
        res.status(200).json({code:300,msg:"请输入分类名称"});
        return false;
    }*/
    co(function* () {
        const findClassify = yield Classify.findOne({
            where:[{
                name:req.body.name.trim()
            }]
        });
        if(findClassify == null){
            const cs = yield Classify.create({'name':req.body.name.trim()});
            if(typeof req.body.BusinessInforId == 'string'){
                co(function* () {
                    var bs = yield BusinessInfor.findById(req.body.BusinessInforId.trim());
                    yield cs.addBusinessInfor(bs);
                }).catch(function (e) {
                    console.log(e)
                });
            }else if(typeof req.body.BusinessInforId == 'object'){
                for (var value in req.body.BusinessInforId){
                    console.log(value)
                    co(function* () {
                        var bs = yield BusinessInfor.findById(req.body.BusinessInforId[value].trim());
                        yield cs.addBusinessInfor(bs);
                    }).catch(function (e) {
                        console.log(e)
                    });
                }
            }
            res.status(200).json({code:200,msg:"添加成功"})
        }else {
            res.status(200).json({code:300,msg:"分类已存在"})
        }
    }).catch(function (e) {
        console.log(e);
    });
});
// 修改分类
router.post('/change',function (req, res) {
    co(function* () {
        const cs = yield Classify.findOne({
            where:[{
                id:req.body.id.trim()
            }]
        });
        cs.update({
            'name': req.body.name.trim()
        });
        yield cs.setBusinessInfors([]);
        if(typeof req.body.BusinessInforId == 'string'){
            co(function* () {
                var bs = yield BusinessInfor.findById(req.body.BusinessInforId.trim());
                yield cs.addBusinessInfor(bs);
            }).catch(function (e) {
                console.log(e)
            });
        }else if(typeof req.body.BusinessInforId == 'object'){
            for (let value of req.body.BusinessInforId){
                co(function* () {
                    var bs = yield BusinessInfor.findById(value.trim());
                    yield cs.addBusinessInfor(bs);
                }).catch(function (e) {
                    console.log(e)
                });
            }
        }
        res.status(200).json({code:200,msg:"修改成功"})
    }).catch(function (e) {
        console.log(e);
    });
});
// 删除分类
router.post('/delete',function (req, res) {
    co(function* () {
        const cs = yield Classify.findOne({
            where:[{
                id:req.body.id.trim()
            }]
        });
        yield cs.setBusinessInfors([]);
        yield Classify.destroy({'where':{'id':req.body.id.trim()}});
        res.status(200).json({code:200,msg:"删除成功"})
    }).catch(function (e) {
        console.log(e)
    });
});

module.exports = router;