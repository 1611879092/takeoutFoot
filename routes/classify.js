var express = require("express");
var router = express.Router();

router.post('/',function (req, res) {
    classify.findAll().then(result => {
        res.status(200).json({code:200,data:result})
    })
})

module.exports = router;
