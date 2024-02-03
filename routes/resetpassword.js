const express = require('express');

const resetpasswordController = require('../controller/resetpassword');


const route = express.Router();

route.get('/forgotForm', resetpasswordController.forgotForm);

route.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword);

route.get('/resetpassword/:id', resetpasswordController.resetpassword);

route.use('/forgotpassword', resetpasswordController.forgotpassword);

module.exports = route;