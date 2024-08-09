const path = require('path');
const rootDir = require('../util/path');
const User = require('../model/userData');
const sequelize = require('../util/database');



exports.showLeaderboard = async (req, res, next) => {
    try{
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'username']
        })
        console.log('ye hai leaderboard', leaderboardofusers)

        res.status(200).json(leaderboardofusers);
    } 
    catch (error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};