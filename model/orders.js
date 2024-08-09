// // const Sequelize = require('sequelize');
// // const sequelize = require('../util/database');


// // const Order = sequelize.define('order', {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     paymentid: Sequelize.STRING,
// //     orderid: Sequelize.STRING,
// //     status: Sequelize.STRING
// // })

// // module.exports = Order;

// const getDb = require('../util/database').getDb;
// const mongo = require('mongodb');
// class Order{
//     constructor(id, paymentId, orderId, status){
//         this.userId = id;
//         this.paymentId = paymentId;
//         this.orderId = orderId;
//         this.status = status;
//     }

//     save(){
//         const db = getDb();
//         return db.collection('order').insertOne(this).then((result) => {
//             console.log("result from order model: ", result);
//             return result;

//         }).catch((err) => {
//             console.log(err);
//         })
//     }
// }

// module.exports = Order;

import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: ObjectId,
    paymentId: String,
    orderId:String,
    status: String
})

export const Order = mongoose.model('order', OrderSchema);