const express = require('express');
const router = express.Router();
const co = require('co');
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






module.exports = router;