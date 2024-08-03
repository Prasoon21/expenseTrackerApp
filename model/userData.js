const getDb = require('../util').getDb;
class User{
    constructor(username, emailId, passId, ispremiumuser, total_expense){
        this.username = username;
        this.emailId = emailId;
        this.passId = passId;
        this.ispremiumuser = ispremiumuser;
        this.total_expense = total_expense;
    }
    save(){

    }
}


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