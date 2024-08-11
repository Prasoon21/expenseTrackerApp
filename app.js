require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

let mongoConnect = await mongoose.connect('mongodb+srv://prasoon-21:tiAHPUTFYHBhVNpE@cluster0.xqhgxxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
console.log("connect: ", mongoConnect);

const app = express();
import cors from 'cors';
import {dailyExpenseRoute} from './routes/dailyExpenseRoute';
import {premiumRoute} from './routes/premiumRoute';
import {purchaseRoute} from './routes/purchase';
import {resetpasswordRoute} from './routes/resetpassword';
import {userRoute} from './routes/userRoute';

import {Expense} from './model/expense';
import {FP} from './model/forgotpassword';
import {Order} from './model/orders';
import {User} from './model/userData';
import {FilesDownloaded} from './model/filesdownloaded';

//console.log(process.env.NODE_ENV)

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order)
// Order.belongsTo(User);

// User.hasMany(FP);
// FP.belongsTo(User);

// User.hasMany(FilesDownloaded);
// FilesDownloaded.belongsTo(User);

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'access.log'),
//         { flags:'a' }
//     )

app.use(express.json());
app.use(cors());
//app.use(helmet());
//app.use(compression())
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


app.listen(7000, () => {
    console.log('Server is running on port: 7000');
    console.log("mongoose connected!");

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "views", "login.html"));

    })
})
