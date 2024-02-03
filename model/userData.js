const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    username: {
        type:Sequelize.STRING,
        allowNull:false
    },
    emailId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    passId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser: Sequelize.BOOLEAN,
    total_expense: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

module.exports = User;