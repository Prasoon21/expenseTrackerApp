// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
// });

// module.exports = sequelize;

const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
let _db;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://prasoon-21:tiAHPUTFYHBhVNpE@cluster0.xqhgxxo.mongodb.net/')
    .then((client) => {
        _db = client.db();
        callback();
        console.log("Connected!");
    })
    .catch((err) => {
        console.log(err);
    })
}

const getDb = function(){
    if(_db){
        return _db;
    }
    throw "No Database found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;