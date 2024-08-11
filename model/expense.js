import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    amount: Number,
    description: String,
    category: String
})

export const Expense = mongoose.model('expense', ExpenseSchema);

//     save(){
//         const db = getDb();
//         return db.collection('expense')
//             .insertOne(this)
//             .then((result) => {
//                 console.log(result)
//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//     }

//     static getExpense(id, offset, limit){
//         const db = getDb();
//         return db.collection('expense').find({_id:new mongo.ObjectId(id)}).skip(+offset).limit(+limit).toArray().then((expense) => {
//             console.log("expenses are: ", expense);
//         }).catch((err) => {
//             console.log("error: ", err);

//         })
//     }

//     static ifPremiumUser(id){
//         const db = getDb();
//         return db.collection('expense').find({_id: new mongo.ObjectId(id)}).toArray().then((expense) => {
//             if(expense.isPremiumUser){
//                 return true;
//             }
//             return false;
//         }).catch((err) => {
//             console.log("error: ", err);
//         })
//     }

//     static destroy(id){
//         const db = getDb();
//         return db.collection('expense').remove(id).then((res) => {
//             console.log("deleted: ", res);
//         }).catch((err) => {
//             console.log("error: ", err);
//         })
//     }

//     static countExpenses(id){
//         const db = getDb();
//         return db.collection('expense').count({userId: id}).then((res) => {
//             console.log("count expenses: ", res);
//             return res;
//         }).catch((err) => {
//             console.log(err);
//         })
//     }
// }

// module.exports = Expense;



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
