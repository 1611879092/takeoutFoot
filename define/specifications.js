const Sequelize = require('sequelize');
const sequelize = require("./database");

const Specification = sequelize.define('Specifications',{
   name:{
       type:Sequelize.STRING
   }
});

module.exports = Specification;