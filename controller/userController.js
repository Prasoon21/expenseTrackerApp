const path = require('path');
const rootDir = require('../util/path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('./userController');
let userId = 0;
const User = require("../model/userData");

exports.generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser}, process.env.TOKEN_SECRET);
};

exports.loginUser = async (req, res, next) => {
    try{
        console.log('Received Post for login: ', req.body);

        const {emailId, passId } = req.body;
        //console.log(req.body);

        if (!emailId) {
            console.log("EmailId is missing");
            return res.status(400).json({ error: "EmailId is missing", message: "EmailId is missing" });
        }
        
        const exist_email = await User.findOne({emailId:emailId});
        console.log("existing email: ", exist_email);
        

        // const existingUser = await User.findOne({ 
        //     where: { emailId: emailId }
        // });

        
        // console.log(existingUser.passId);
        // console.log(passId);
        //console.log('Existing User: ', existingUser);
        if(!exist_email){
            res.json({success:false, status:404, message:"User not found ... Please signup first"});
        } else{
            userId = exist_email._id;
            bcrypt.compare(passId, exist_email.passId, (err,result) => {
                if(err){
                    res.json({success:false, message:"Something went wrong"});
                } else if(result === true){
                    const generatedToken = userController.generateAccessToken(userId, exist_email.isPremiumUser);
                    console.log("Generated token: ", generatedToken);
                    return res.json({success:true, message:"User login successfull", token: generatedToken});
                } else{
                    res.status(403).json({success:false, message: "incorrect password"});
                }

            })
        }
        // if (exist_email.length > 0) {
        //     bcrypt.compare(passId, user[0].passId, (err, result) => {
        //         if(err){
        //             res.status(500),json({success: false, message: 'something wen wrong'});
        //         }
        //         else if(result === true){

        //             res.status(200).json({success: true, message: "User logged in successfuly", token: userController. generateAccessToken(user[0].id, user[0].username, user[0].ispremiumuser)});
        //         } else{
        //             console.log("Password not match");
        //             return res.status(401).json({ error: "Password incorrect", message: "Password incorrect" });
        //         }
        //     })
            
        // } else{
        //     console.log("email not found");
        //     return res.status(404).json({ error: "EmailId not found", message: "EmailId not found" });
        // }
    } catch(error) {
        console.error("Error in login User: ", error);
        res.status(500).json({ error: "Error in login User" });
    }     
};

exports.getLogin = async (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
};

exports.postUser = async (req, res, next) => {
    try{
        console.log('Received Post for adding user: ', req.body);

        const {username, emailId, passId } = req.body;
        //console.log(req.body);

        // const user = new User(username, emailId, passId);
        // user.save().then((res) => {
        //     console.log(res);
        // }).catch((err) => {
        //     console.log(err);
        // })

        
        const existingUser = await User.find({emailId:emailId});
        console.log('Existing User: ', existingUser);
        if (existingUser.length > 0) {
            console.error("Email already in use");
            return res.status(400).json({ error: "Email already in use", message: "Email already in use" });
        }
    
        const hashedPassword = await bcrypt.hash(passId, 10);

        const newUser = new User({
            username: username,
            emailId: emailId,
            passId: hashedPassword,
            isPremiumUser: false,
            totalExpense: 0
        });

        const savedUser = await newUser.save();
        console.log(" New User Created: ", savedUser);

        res.status(201).json({ message: 'Successfully created new user', user: savedUser });
        

        
        // console.log('updated success');
        // //console.log("User Created Successfully ", data);
        // res.status(201);//.json(data);
        
    } catch(error) {
        console.error("Error Creating User: ", error);
        res.status(500).json({ error: "Error Creating User" });
    }     
};

exports.getSignUp = async (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'signup.html'));
};

