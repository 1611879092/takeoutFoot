const express = require('express');
const router = express.Router();
const co = require('co');
const Unit = require('../../define/unit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('back/units', { title: '单位配置' });
});

// 获取数据
router.post('/',function (req, res, next) {
    co(function* () {
      const unit = yield Unit.findAndCountAll();
      console.log(unit);
      res.status(200).json({code:0,msg:'',count:unit.count,data:unit.rows})
    }).catch(function (e) {
        console.log(e)
    })
});

// 添加单位
router.post('/add',function (req, res, next) {
  co(function* () {
    const unit = yield Unit.create({
        'name':req.body.name
    });
      res.status(200).json({code:200,msg:'添加成功'})
  }).catch(function (e) {
      console.log(e)
  })
});

//删除单位
router.post('/delete',function (req, res, next) {
   co(function* () {
       yield Unit.destroy({'where':{'id':req.body.id}});
       res.status(200).json({code:200,msg:'删除成功'})
   }).catch(function (e) {
       console.log(e)
   })
});

module.exports = router;
