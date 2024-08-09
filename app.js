require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

let mongoConnect = await mongoose.connect('mongodb+srv://prasoon-21:tiAHPUTFYHBhVNpE@cluster0.xqhgxxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
console.log("connect: ", mongoConnect);

const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const cors = require('cors');

const userRoute = require('./routes/userRoute');
const dailyExpenseRoute = require('./routes/dailyExpenseRoute');

const purchaseRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premiumRoute');
const resetpasswordRoute = require('./routes/resetpassword'); 

//const sequelize = require('./util/database');
const mongoConnect = require('./util/database').mongoConnect;


const User = require('./model/userData');
const Expense = require('./model/expense');
const Order = require('./model/orders');
const Forgotpassword = require('./model/forgotpassword');
const FilesDownloaded = require('./model/filesdownloaded');

//console.log(process.env.NODE_ENV)

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order)
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// User.hasMany(FilesDownloaded);
// FilesDownloaded.belongsTo(User);

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'access.log'),
//         { flags:'a' }
//     )

app.use(express.json());
app.use(cors());
//app.use(helmet());
app.use(compression())
//app.use(morgan('combined', { stream: accessLogStream }));

app.use('/user', userRoute);
app.use('/expense', dailyExpenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password', resetpasswordRoute);



// sequelize.sync()
//     .then(() => {
//         console.log('Database synced successfully');
//         app.listen(process.env.PORT || 7000, () => {
//             console.log('Server is running on port ', process.env.PORT);
        
//             app.get('/', (req, res) => {
//                 res.sendFile(path.join(__dirname, "views", "login.html"));
        
//             })
//         });
//     })
//     .catch(err => console.log(err))


app.listen(process.env.PORT || 7000, () => {
    console.log('Server is running on port: ', process.env.PORT);
    console.log("mongoose connected!");

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "views", "login.html"));

    })
})
