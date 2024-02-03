const express = require('express');
const route = express.Router();
const userAuthenticate = require('../middleware/auth');
const expenseController = require('../controller/expenseController');

route.get('/getExpense',userAuthenticate.authenticate , expenseController.getExpense);
route.get('/dashboard', expenseController.getHtml);
route.post('/',userAuthenticate.authenticate, expenseController.addExpense);
route.delete('/deleteExpense/:id', expenseController.deleteExpense);


module.exports = route;