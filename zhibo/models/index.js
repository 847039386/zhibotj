const mongoose = require("mongoose");
const config = require('../config');
const db_port = config.db.port || 27017;

mongoose.connect(`mongodb://${config.db.host}:${db_port}/${config.db.database}`, {
    poolSize: 20,
    useMongoClient: true,
}, function (err) {
    if (err) {
        process.exit(1);
    } else {
        console.log('数据库未出任何问题，正常启动：mongoDB：' + db_port)
    }
});
mongoose.Promise = global.Promise;


const Company = require('./company');
const Game = require('./game');
const Settlein = require('./settlein');
const Platform = require('./platform');
const User = require('./user');
const Work = require('./work');
const Clearing = require('./clearing');

exports.Company = Company;
exports.Game = Game;
exports.Settlein = Settlein;
exports.Platform = Platform;
exports.User = User;
exports.Work = Work;
exports.Clearing = Clearing;
