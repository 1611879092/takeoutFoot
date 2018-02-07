const Sequelize = require('sequelize');
const sequelize = require("./database");

const BusinessInfor = sequelize.define('BusinessInfor',{
    'name':{                    //店铺名称
        type: Sequelize.STRING
    },
    'phone':{                   //店铺电话
        type: Sequelize.STRING
    },
    'address':{                 //店铺地址
        type: Sequelize.STRING
    },
    'distributionTimeBegin':{        //配送开始时间
        type: Sequelize.STRING
    },
    'distributionTimeEnd':{        //配送结束时间
        type: Sequelize.STRING
    },
    'qualification':{           //营业资质
        type:Sequelize.STRING
    },
    'distributionfee':{         //配送费
        type: Sequelize.INTEGER
    },
    'sendfee':{                 //起送费
        type: Sequelize.INTEGER
    },
    'invoice':{                 //是否开具发票
        type:Sequelize.STRING
    },
    'coordinate':{              //坐标（x,y）
        type:Sequelize.STRING
    }
});

module.exports = BusinessInfor;