const express = require('express');
const path = require('path');

const route = express.Router();

const rootDir = require('../util/path');
const authenticateMiddleware = require('../middleware/auth');

const userController = require('../controller/userController');
const expenseController = require('../controller/expenseController');


route.post('/login', userController.loginUser);
route.get('/login', userController.getLogin);

route.post('/signup', userController.postUser);
route.get('/signup', userController.getSignUp);

route.get('/download', authenticateMiddleware.middleware, expenseController.downloadexpense);

module.exports = route;