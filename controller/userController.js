import path from 'path';
import rootDir from '../util/path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userController from './userController';
let userId = 0;
import User from "../model/userData";

exports.generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser}, 'r@nd0mlyG3n3r@tedK3yW!thSpec!alCh@ract3rs');
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
        
        const exist_email = await User.find({emailId:emailId});
        console.log("existing email: ", exist_email[0]);
        

        // const existingUser = await User.findOne({ 
        //     where: { emailId: emailId }
        // });

        
        // console.log(existingUser.passId);
        // console.log(passId);
        //console.log('Existing User: ', existingUser);
        if(exist_email == null){
            res.json({success:false, status:404, message:"User not found ... Please signup first"});
        } else{
            userId = exist_email[0]._id;
            bcrypt.compare(passId, exist_email[0].password, (err,result) => {
                if(err){
                    res.json({success:false, message:"Something went wrong"});
                } else if(result == true){
                    return res.json({success:true, message:"User login successfull", token: userController.generateAccessToken(userId, exist_email.ispremiumuser)});
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
        if (existingUser==[]) {
            console.error("Email already in use");
            return res.status(400).json({ error: "Email already in use", message: "Email already in use" });
        }
    
        bcrypt.hash(passId, 10, async (err, hash) => {
            console.log(err);
            // await User.create({
            //     username: username,
            //     emailId: emailId,
            //     passId: hash
            // });
            //const newUser = new User(username, emailId, hash);
            const newUser = User.create({name: username, email:emailId, password: hash, ispremiumuser:false, totalExpense:0 });
            //const newUserCreated = await newUser.save();
            console.log("New user created : ", newUser);
            res.status(201).json({message: 'Successfully Create new user'});
        })
        

        
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

