const uuid = require('uuid');
const path = require('path');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config();

import {User} from '../model/userData';
import {FP} from '../model/forgotpassword';

const forgotForm = async(req, res, next) => {
    try{
        res.sendFile(path.join(__dirname, '..', 'views', 'forgotForm.html'));
    } catch(err){
        console.log('error in getting html file:', err);
    }
}


const forgotpassword = async(req, res, next) => {
    try{
        const emailId = req.body.emailId;
        console.log('entered email:', emailId);
        const user = await User.find({emailId:emailId});
        if(user){
            const id = uuid.v4();
            const fp = new FP({userId:req.user._id, isActive:true })
            await fp.save();
            // user.createFP({ id, active: true })
            //     .catch(err => {
            //         throw new Error(err)
            //     })
            
            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.NEW_TEST_API;
        
            const tranEmailApi = new Sib.TransactionalEmailsApi();
        
            const sender = {
                email: 'parasharprasoon34@gmail.com'
            }
    
            const receiver = [
                {
                    email: emailId
                }
            ]
        
            tranEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: 'Sending with sendinblue is Fun',
                textContent: 'This mail is regarding reset password',
                htmlContent: `<a href="http://localhost:7000/password/resetpassword/${id}">Reset Password</a>`,

            }).then((response) => {
                console.log('API called successfully.');
                console.log('Sendinblue API response:', response);
                if (response && response.messageId) {
                    // Assuming that presence of 'messageId' indicates a successful response
                    return res.status(200).json({ message: 'Link to reset password sent to your mail ', success: true });
                } else {
                    throw new Error('Invalid or missing status code in Sendinblue API response.');
                }
            
                //return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})
            }).catch((error) => {
                throw new Error(error);
            })
        } else{
            throw new Error('User does not exist')
        }
    } catch(err){
        console.error(err);
        return res.json({ message: err, success: false});
    }
}

const resetpassword = (req, res) => {
    const id = req.params.id;
    FP.find({ _id : id }).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {
    try{
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        FP.find({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ passId: hash }).then(() => {
                                res.status(201).json({message: 'Successfully update the new password'})
                            })
                        });
                    });
                } else{
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }

            })
        })
    } catch(error) {
        return res.status(403).json({ error, success: false })
    }
}

module.exports = {
    forgotForm,
    forgotpassword,
    updatepassword,
    resetpassword
}