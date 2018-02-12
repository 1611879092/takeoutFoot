const express = require('express');
const router = express.Router();
const sequelize = require("./database");

const Classify = require('./Classify');
const Product = require('./Product');
const Unit = require('./Unit');
const specifications = require('./specifications');
const BusinessInfor = require('./BusinessInfor');
const ClassAndBusiness =require('./ClassAndBusiness');
const Resource =require('./Resource');

Classify.hasMany(Product);
Product.belongsTo(Classify);

Unit.hasMany(Product);
Product.belongsTo(Unit);

BusinessInfor.belongsToMany(Classify,{through:'ClassAndBusiness'});
Classify.belongsToMany(BusinessInfor,{through:'ClassAndBusiness'});

// Classify.create({name:'全部'});

// sequelize.sync({force:true});

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;