const getDb = require('../util/database').getDb;
class Expense{
    constructor(amount, description, category){
        this.amount = amount;
        this.description = description;
        this.category = category;
    }

    save(){
        const db = getDb();
        return db.collection('expense')
            .insertOne(this)
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

module.exports = Expense;



// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expense = sequelize.define('expense', {
//     amount: {
//         type:Sequelize.INTEGER,
//         defaultValue: 0
//     },
//     description:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     category: {
//         type:Sequelize.STRING,
//         allowNull: false
//     },
    
// });

// Expense.afterCreate(async (expense, options) => {
//     const user = await expense.getUser();
//     console.log('what is this:' ,user);
//     const totalExpense = await Expense.sum('amount', { where: {userId: user.id}});
//     console.log('total hai', totalExpense);
//     user.total_expense = totalExpense;
//     await user.save();
// });

// module.exports = Expense;
