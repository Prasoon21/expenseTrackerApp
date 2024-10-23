// // const Sequelize = require('sequelize');
// // const sequelize = require('../util/database');

// // const Forgotpassword = sequelize.define('forgotpassword', {
// //     id: {
// //         type: Sequelize.UUID,
// //         allowNull: false,
// //         primaryKey: true
// //     },

// //     active: Sequelize.BOOLEAN,
// //     expiresby: Sequelize.DATE
// // })

// // module.exports = Forgotpassword;

// const getDb = require('../util/database').getDb;
// const mongo = require('mongodb');

// class FP{
//     constructor(id, isActive){
//         this.userId = id;
//         this.isActive = isActive;
//     }

//     save(){
//         const db = getDb();
//         return db.collection('fp').insertOne(this).then((result) => {
//             console.log("result: ", result);
//             return result;
//         }).catch((err) => {
//             console.log("error: ", err);
//         })
//     }
// }

// module.exports = FP;

const ObjectId = require('mongodb');
const mongoose = require('mongoose');
const FPSchema = new mongoose.Schema({
    userId: Number,
    isActive: Boolean
})

module.exports = FPSchema;