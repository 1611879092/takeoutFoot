const Sequelize = require('sequelize');
const sequelize = require("./database");

const ClassAndBusiness = sequelize.define('ClassAndBusiness');

module.exports = ClassAndBusiness;