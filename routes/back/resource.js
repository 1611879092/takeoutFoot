const express = require('express');
const router = express.Router();
const co = require('co');
const multiparty = require('multiparty');
const fs = require('fs');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Resource = require('../../define/Resource');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('back/resource', {title: '商家信息'});
});
// 获取资源库数据
router.post('/', function (req, res) {
    const countPerPage = 15;
    co(function* () {
        const resource = yield Resource.findAndCountAll({
            'limit': countPerPage,                      // 每页多少条
            'offset': countPerPage * (req.body.page - 1),  // 跳过多少条
            where: {
                name: {
                    [Op.like]: '%' + req.body.keyword + '%'
                }
            }
        });
        res.status(200).json({
            code: 0,
            msg: "",
            count: Math.ceil((resource.count) / countPerPage),
            data: resource.rows
        })
    }).catch(function (e) {
        console.log(e)
    });
});

// 添加资源库资源
router.post('/add', function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    const form = new multiparty.Form({uploadDir: './public/files/'});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        const filesTmp = JSON.stringify(files);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            if(files.inputFile.length != 'undefined'){
                for (var i = 0; i < files.inputFile.length; i++) {
                    const inputFile = files.inputFile[i];
                    const uploadedPath = inputFile.path;
                    // qualification += ',/files/' + inputFile.originalFilename;
                    const dstPath = './public/files/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    fs.rename(uploadedPath, dstPath, function (err) {
                        if (err) {
                            console.log(err)
                            return false;
                        } else {

                        }
                    });
                    co(function* () {
                        const resource = yield Resource.create({
                            'name': inputFile.originalFilename,
                            'type': inputFile.headers['content-type'],
                            'size': inputFile.size,
                            'path': 'files/'+inputFile.originalFilename,
                        });
                    }).catch(function (e) {
                        console.log(e)
                    })
                }
            }
            res.status(200).json({code:200,msg:"上传成功"})
        }
    });
});

module.exports = router;