const express = require('express');
const router = express.Router();
const co = require('co');
const Classify = require('../../define/Classify');



/* GET home page. */
router.get('/', function(req, res, next) {
    /*co(function* () {
        const use = yield Use.findById(1,{
            'include':[Account]
        });
        console.log(use.get({'plain': true}));
    }).catch(function(e) {
        console.log(e);
    });*/
  res.render('back/menus', { title: '' });
});

router.post('/',function (req, res) {
    co(function* () {
        const classify = yield Classify.findAndCountAll();
        res.status(200).json({code:0,msg:"",count:classify.count,data:classify.rows})
    }).catch(function (e) {
        console.log(e)
    });
});

router.post('/add',function (req, res) {
    if(req.body.id == ""){
        Classify.create({
            name:req.body.name
        });
        res.status(200).json({code:200,msg:"插入成功"})
    }else {
        Classify.update({
            name:req.body.name
        },{
            'where':{'id':req.body.id}
        });
        res.status(200).json({code:200,msg:"修改成功"})
    }
});

router.post('/delete',function (req, res) {
    Classify.destroy({'where':{'id':req.body.id}});
    res.status(200).json({code:200,msg:"删除成功"})
});

module.exports = router;