const express = require('express');

const purchaseController = require('../controller/purchaseController');

const authenticateMiddleware = require('../middleware/auth');

const route = express.Router();

route.get('/premiummembership', authenticateMiddleware.middleware, purchaseController.purchasepremium);

route.post('/updatetransactionstatus', authenticateMiddleware.middleware, purchaseController.updateTransactionStatus);

module.exports = route;