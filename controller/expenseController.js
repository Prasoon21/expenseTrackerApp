const Sequelize = require('sequelize');
const Expense = require('../model/expense');
const path = require('path');
const sequelize = require('../util/database');
const User = require('../model/userData');
const AWS = require('aws-sdk');
const FilesDownloaded = require('../model/filesdownloaded');



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

        let totalItems;
        const filesData = await FilesDownloaded.findAll( {where: {userId: req.user.id }})

        totalItems = await Expense.count();
        const expenses = await Expense.findAll({
            offset: (page-1) * limit,
            limit: limit,
        });

        console.log('User ID:', req.user.id);
        console.log('Limit:', limit);
        console.log('Expenses:', expenses);
        console.log('Files Data:', filesData);

        res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: limit * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page-1,
            lastPage: Math.ceil(totalItems / limit),
            filesData: filesData,
            limit: limit
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
        //console.log(req.body.amount);
        console.log('missing expense req fields');
        return res.sendStatus(500)
    }

    try {
        const { amount, description, category} = req.body;
    
    
        console.log(amount,description,category);

        const data=await Expense.create({
            amount:amount,
            description:description,
            category:category,
            userId:req.user.id,
            
            
         });
        //const expense = await Expense.create({ userId, amount, description, category });
        //await t.commit();
        console.log('updated success');
    
        res.status(201).json(data)
    } catch (error) {
        //await t.rollback()
        console.log(error,JSON.stringify(error))

        res.status(501).json({error})
    
    }

};

exports.deleteExpense= async (req,res,next)=>{
    try {
        const t = await sequelize.transaction();
        if(!req.params.id||req.params.id==='undefined')
        {
            console.log('ID is Missing');
            return res.sendStatus(420)
        }
        const expenseId=req.params.id;
        
        const expense = await Expense.findByPk(expenseId, { transaction: t });
        if(!expense){
            console.log(`Expense with ID ${expenseId} not found`);
            return res.sendStatus(404);
        }

        const userId = expense.userId;
        const amount = expense.amount;
        
        await Expense.destroy({where:{id:expenseId}, transaction: t })

        const user = await User.findByPk(userId);
        if(user){
            user.total_expense -= amount;
            await user.save();
        }
        await t.commit()

        console.log(`Successfully deleted expense with ID ${expenseId}`);
        res.sendStatus(200);
        console.log(`sucessfully deleted ${expenseId}`);
    } catch (error) {
        console.log(JSON.stringify(error));
        await t.rollback();
        res.status(404).json({error})
        
    }
    
}

