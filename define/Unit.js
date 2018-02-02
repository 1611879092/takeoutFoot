const Sequelize = require('sequelize');
const sequelize = require('./database');

const Unit = sequelize.define('Unit',{
    name:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Unit;