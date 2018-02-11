const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const fs = require('fs');
const co = require('co');
const BusinessInfor = require('../define/BusinessInfor');

router.post('/uploading', function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    var qualification = '';
    const form = new multiparty.Form({uploadDir: './public/files/'});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        // console.log(fields.id[0])
        const filesTmp = JSON.stringify(files);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log(files.inputFile.length);
            if(files.inputFile.length != 'undefined'){
                for (var i = 0; i < files.inputFile.length; i++) {
                    const inputFile = files.inputFile[i];
                    const uploadedPath = inputFile.path;
                    qualification += ',/files/' + inputFile.originalFilename;
                    const dstPath = './public/files/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    fs.rename(uploadedPath, dstPath, function (err) {
                        if (err) {
                            console.log(err)
                            return false;
                        } else {

                        }
                    });
                }
            }
            BusinessInfor.update({
                qualification:qualification.substring(1)
            },{
                where:{
                    id:fields.id[0]
                }
            });
            res.status(200).json({code:200,msg:"上传成功"})
        }
    });
});

router.post('/delete', function (req, res) {
    res.status(200).json({code:200,msg:"删除成功"})
    return false
});

module.exports = router;