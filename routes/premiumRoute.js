const express = require('express');
const path = require('path');

const route = express.Router();

const rootDir = require('../util/path');

const premiumController = require('../controller/premiumController');

route.get('/showleaderboard', premiumController.showLeaderboard);

module.exports = route;