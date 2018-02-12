const Sequelize = require('sequelize');
const sequelize = require("./database");

const Resource = sequelize.define('Resource',{
    'name':{                    //资源名称
        type: Sequelize.STRING
    },
    'type':{                    //资源类型
        type: Sequelize.STRING
    },
    'size':{                    //资源大小
        type: Sequelize.STRING
    },
    'path':{                    //资源路径
        type: Sequelize.STRING
    }
});

module.exports = Resource;