const Sequelize = require('sequelize');
const sequelize = require("./database");

const Product = sequelize.define('Product',{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        comment:'商品名称'
    },
    price:{
        type:Sequelize.FLOAT
    },
    con:{
        type:Sequelize.TEXT
    },
    img:{
        type:Sequelize.STRING
    },
    fabulous:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    stock:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
});

module.exports = Product;