const express = require('express');
const router = express.Router();
const co = require('co');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const BusinessInfor = require('../../define/BusinessInfor');
const Classify = require('../../define/Classify');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('back/businessInfor', {title: '商家信息'});
});
// 获取分店数据
router.post('/', function (req, res) {
    const countPerPage = 15;
    co(function* () {
        const businessInfor = yield BusinessInfor.findAndCountAll({
            'limit': countPerPage,                      // 每页多少条
            'offset': countPerPage * (req.body.page - 1),  // 跳过多少条
            where: {
                name: {
                    [Op.like]: '%' + req.body.keyword + '%'
                }
            }
        });
        for (var i = 0; i < businessInfor.rows.length; i++) {
            businessInfor.rows[i].distributionTimeBegin = businessInfor.rows[i].distributionTimeBegin.split(',');
            businessInfor.rows[i].distributionTimeEnd = businessInfor.rows[i].distributionTimeEnd.split(',');
        }
        res.status(200).json({
            code: 0,
            msg: "",
            count: Math.ceil((businessInfor.count) / countPerPage),
            data: businessInfor.rows
        })
    }).catch(function (e) {
        console.log(e)
    });
});
// 添加分店
router.post('/add', function (req, res) {
    if (!req.body.name || req.body.name.trim() == '') {
        res.status(200).json({code: 300, 'msg': '请输入分类名称'});
        return false;
    }
    if (req.body.qualification == undefined) {
        req.body.qualification = ''
    }
    if (req.body.invoice == undefined) {
        req.body.invoice = ''
    }
    var distributionTimeBegin = '';
    var distributionTimeEnd = '';
    for (var k in req.body) {
        if (k.indexOf('distributionTimeBegin') != -1) {
            distributionTimeBegin += ',' + req.body[k]
        } else if (k.indexOf('distributionTimeEnd') != -1) {
            distributionTimeEnd += ',' + req.body[k]
        }
    }
    co(function* () {
        const businessInfor = yield BusinessInfor.findOne({
            where: {
                name: req.body.name.trim()
            }
        });
        if (businessInfor == null) {
            const bc = yield BusinessInfor.create({
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
            const classify1 = yield Classify.findOne({
                where: {
                    name: '全部'
                }
            });
            // 默认添加全部分类
            yield bc.addClassify(classify1);
            res.status(200).json({code: 200, 'msg': '添加成功', data: bc})
        } else {
            res.status(200).json({code: 300, 'msg': '店铺已存在'})
        }
    }).catch(function (e) {
        console.log(e)
    });
});
// 修改分类
router.post('/change',function (req, res) {
    if (!req.body.name || req.body.name.trim() == '') {
        res.status(200).json({code: 300, 'msg': '请输入分类名称'});
        return false;
    }
    if (req.body.qualification == undefined) {
        req.body.qualification = ''
    }
    if (req.body.invoice == undefined) {
        req.body.invoice = ''
    }
    var distributionTimeBegin = '';
    var distributionTimeEnd = '';
    for (var k in req.body) {
        if (k.indexOf('distributionTimeBegin') != -1) {
            distributionTimeBegin += ',' + req.body[k]
        } else if (k.indexOf('distributionTimeEnd') != -1) {
            distributionTimeEnd += ',' + req.body[k]
        }
    }
    co(function* () {
        const cs = yield BusinessInfor.findOne({
            where:[{
                id:req.body.id.trim()
            }]
        });
        cs.update({
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
        res.status(200).json({code:200,msg:"修改成功"})
    }).catch(function (e) {
        console.log(e);
    });
});


// 删除分类
router.post('/delete',function (req, res) {
    co(function* () {
        const cs = yield BusinessInfor.findOne({
            where:[{
                id:req.body.id.trim()
            }]
        });
        yield BusinessInfor.destroy({'where':{'id':req.body.id.trim()}});
        res.status(200).json({code:200,msg:"删除成功"})
    }).catch(function (e) {
        console.log(e)
    });
});

module.exports = router;