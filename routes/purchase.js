const express = require('express');

const purchaseController = require('../controller/purchaseController');

const authenticateMiddleware = require('../middleware/auth');

const route = express.Router();

route.get('/premiummembership', authenticateMiddleware.authenticate, purchaseController.purchasepremium);

route.post('/updatetransactionstatus', authenticateMiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = route;