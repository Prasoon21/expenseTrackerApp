// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
// });

// module.exports = sequelize;

const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://prasoon-21:tiAHPUTFYHBhVNpE@cluster0.xqhgxxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then((client) => {
        callback(client);
        console.log("Connected!");
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = mongoConnect;