const Sequelize = require('sequelize');
const sequelize = require("./database");

const Classify = sequelize.define('Classify',{
    'name':{                    //分类名称
        type: Sequelize.STRING
    },
    'businessID':{
        type: Sequelize.STRING
    }
});

module.exports = Classify;