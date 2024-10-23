const jwt = require('jsonwebtoken');
const User = require('../model/userData');

exports.middleware = async (req, res, next) => { 
    try{
        const token = req.header('Authorization');
        if(!token){
            console.log("Authorization header missing");
            return res.status(401).json({ success: false, message: "Authorization header missing" });
        }

        const tokenParts = token.split(' ');
        if(tokenParts.length !== 2 || tokenParts[0] !== 'Bearer'){
            console.log("Invalid Authorization header format");
            return res.status(401).json({ success: false, message: "Invalid Authorization header format" });
        }
        console.log("token to verify: ", tokenParts[1]);
        
        const verifiedUser = jwt.verify(tokenParts[1], process.env.TOKEN_SECRET);
        console.log('user id --->>>>>', verifiedUser.userId);
        // User.findByPk(user.userId).then(user => {
        //     console.log(JSON.stringify(user));
        //     req.user = user;
        //     next();

        // })
        // .catch(err => { throw new Error(err) })
        req.user = await User.findById(verifiedUser.userId);
        if(!req.user){
            console.log("User not found");
            return res.status(404).json({ success:false, message: "User not found" });
        }

        console.log('user--> ', req.user);
        next();
    } catch (err){
        console.log("Token verification failed: ",err);
        return res.status(401).json({ success:false, message: "Unauthorized" });
    }
}

