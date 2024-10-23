const Sequelize = require('sequelize');
const Expense = require('../model/expense');
const path = require('path');
const sequelize = require('../util/database');
const User = require('../model/userData');
const AWS = require('aws-sdk');
const FilesDownloaded = require('../model/filesdownloaded');
const { response } = require('express');
let userId = 0;


function uploadToS3(data, filename){
    const BUCKET_NAME = 'expensetrackyapp';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })
    
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if(err){
                console.log('Something is going wrong', err);
                reject(err);
            } else{
                console.log('Success: ', s3response);
                resolve(s3response.Location);
            }
        })
    })
    
    
}

exports.downloadexpense = async(req, res) => {
    try{
        const expenses = await Expense.findAll({where: {userId:req.user.id}});
        console.log('getting something: ', expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, filename);
        const filesData = await FilesDownloaded.create({
            url: fileURL,
            userId: userId
        });
        res.status(200).json({ filesData, fileURL, success: true});
    } catch(err){
        console.log(err);
        res.status(500).json({filesData: '', fileURL: '', success: false, err:err});
    }
    
}

//const limit = 10;

exports.getExpense = async (req,res,next)=>{
    try{
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log("user");
        userId = req.user._id;

        // const filesData = await FilesDownloaded.findAll( {where: {userId: userId }})
        console.log("user id from request: ", typeof(userId));
        console.log("Query: ", { userId: userId });

        const totalItems = await Expense.countDocuments({ userId: userId });

        const expenses = await Expense.find({userId: userId})
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        console.log("expenses through get Expense: ", expenses);
        const user = await User.findById(userId);
        console.log("user found: ", user);

        if(!user){
            return res.status(404).json({ message: 'User not Found' });
        }

        console.log("isPremium USer: ", user.isPremiumUser);

        return res.status(200).json({
            expenses,
            currentPage: page,
            totalPages: Math.ceil(totalItems/limit),
            totalItems,
            isPremiumUser: user.isPremiumUser
        });
    } catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

};

exports.getHtml = async (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dailyExpense.html'));
}

exports.addExpense= async (req,res,next)=>
{
    //const t = await sequelize.transaction();
    console.log("Received POST request for adding expense:", req.body);
    // console.log(req.body.amount);
    if(!req.body.amount||!req.body.description||!req.body.category)
    {
        console.log('missing expense req fields');
        return res.sendStatus(500)
    }

    try {
        const { amount, description, category} = req.body;
        
        const date = req.body.date || new Date();
    
        console.log("Amount: ", amount, "Description: ", description, "Category: ",category, "Date: ", date);

        userId = req.user._id;
        console.log("user id in add expense :", userId);
        const expense = await Expense.create({
            userId: userId, 
            amount: amount, 
            description: description, 
            date: date, 
            category: category
        });

        console.log("expense after creation: ", expense);
        const user = await User.findById(userId);
        console.log("user", user);
        const newTotalExpense = parseInt(user.totalExpense) + parseInt(amount);
        const update = await User.findOneAndUpdate(
            { _id:userId }, 
            { totalExpense: newTotalExpense }, 
            { new: true }
        );

        console.log("Now total amount is: ", newTotalExpense)
        res.status(201).json({ expense, user: update})
    } catch (error) {
        console.log(error,JSON.stringify(error))
        res.status(500).json({ error: 'Internal Server Error' })
    }

};

exports.deleteExpense= async (req,res,next)=>{
    try {
        // const t = await sequelize.transaction();
        // if(!req.params.id||req.params.id==='undefined')
        // {
        //     console.log('ID is Missing');
        //     return res.sendStatus(420)
        // }
        // const expenseId=req.params.id;
        
        // const expense = await Expense.findByPk(expenseId, { transaction: t });
        // if(!expense){
        //     console.log(`Expense with ID ${expenseId} not found`);
        //     return res.sendStatus(404);
        // }

        // const userId = expense.userId;
        // const amount = expense.amount;
        
        // await Expense.destroy({where:{id:expenseId}, transaction: t })

        // const user = await User.findByPk(userId);
        // if(user){
        //     user.total_expense -= amount;
        //     await user.save();
        // }
        // await t.commit()
        const expenseAmount = await Expense.findById(req.params.id);
        console.log("?: ", expenseAmount);
        const userTotalExpense = await User.findById(expenseAmount.userId);
        console.log("param.id",userTotalExpense.totalExpense);
        const newExpense = parseInt(userTotalExpense.totalExpense) - parseInt(expenseAmount.amount);
        //const update= await User.updateExpense(req.user._id,userTotalExpense.totalExpense)
        console.log("total expense after deletion is",newExpense);
        await User.updateOne({_id : req.user._id},{totalExpense:newExpense},{new : true});
        Expense.deleteOne({_id: req.params.id}).then((response) => {
            res.json({success: true, message:"deleted -> ", response})
        }).catch((err) => {
            console.log(err);
        })
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(404).json({error})
        
    }
    
}

