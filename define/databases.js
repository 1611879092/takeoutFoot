const express = require('express');
const router = express.Router();
const sequelize = require("./database");


/*const Classify = require('./Classify');
const Product = require('./Product');
const Unit = require('./Unit');
const specifications = require('./specifications');*/

const businessInfor = require('./BusinessInfor');

/*Classify.hasMany(Product);
Product.belongsTo(Classify);

Unit.hasMany(Product);
Product.belongsTo(Unit);*/

// sequelize.sync();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
