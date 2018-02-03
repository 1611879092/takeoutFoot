const express = require('express');
const router = express.Router();
const co = require('co');
const Classify = require('../../define/Classify');
const BusinessInfor = require('../../define/BusinessInfor');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('back/businessInfor', {title: '商家信息'});
});

router.post('/',function (req, res) {
    co(function* () {
        const businessInfor = yield BusinessInfor.findAndCountAll();
        res.status(200).json({code:0,msg:"",count:businessInfor.count,data:businessInfor.rows})
    }).catch(function (e) {
        console.log(e)
    });
});

router.post('/add',function (req, res) {
    co(function* () {
        const businessInfor = yield BusinessInfor.findAll({
            where:{
                name:req.body.name
            }
        });
        if(businessInfor.length == 0){
            var bc = yield BusinessInfor.create({'name': req.body.name});
            var classify1 = yield Classify.findOne({
                where:{
                    name: '全部'
                }
            });
            // 默认添加全部分类
            yield bc.addClassify(classify1);
            res.status(200).json({code:200,'msg':'添加成功'})
        }else {
            res.status(200).json({code:300,'msg':'店铺已存在'})
        }
    }).catch(function (e) {
        console.log(e)
    });
});




module.exports = router;