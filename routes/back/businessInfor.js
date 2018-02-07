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
    console.log(req.body)
    if(!req.body.name || req.body.name.trim() == ''){
        res.status(200).json({code:300,'msg':'请输入分类名称'});
        return false;
    }
    if (req.body.qualification == undefined){
        req.body.qualification=''
    }
    if (req.body.invoice == undefined){
        req.body.invoice=''
    }
    var distributionTimeBegin = '';
    var distributionTimeEnd = '';
    for (var k in req.body){
        if(k.indexOf('distributionTimeBegin') != -1){
            distributionTimeBegin += ',' + req.body[k]
        }else if(k.indexOf('distributionTimeEnd') != -1){
            distributionTimeEnd += ',' + req.body[k]
        }
    }
    co(function* () {
        const businessInfor = yield BusinessInfor.findOne({
            where:{
                name:req.body.name.trim()
            }
        });
        if(businessInfor == null){
            var bc = yield BusinessInfor.create({
                'name': req.body.name.trim(),
                'phone': req.body.phone.trim(),
                'address': req.body.address.trim(),
                'distributionTimeBegin': distributionTimeBegin.substring(1).trim(),
                'distributionTimeEnd': distributionTimeEnd.substring(1).trim(),
                'qualification': req.body.qualification.trim(),
                'distributionfee': req.body.distributionfee.trim(),
                'sendfee': req.body.sendfee.trim(),
                'invoice': req.body.invoice.trim(),
                'coordinate': req.body.coordinate.trim()
            });
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