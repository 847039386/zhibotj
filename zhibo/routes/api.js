const router = require('koa-router')();
const Company = require('../controllers').Company;
const Game = require('../controllers').Game;
const Platform = require('../controllers').Platform;
const User = require('../controllers').User
const Settlein = require('../controllers').Settlein
const Work = require('../controllers').Work
const Clearing = require('../controllers').Clearing
const Home = require('../controllers').Home



router.prefix('/api')

//Home
router.get('/home/info', Home.getHomeBaseInformation)

// 公司
router.get('/company/qs', Company.getResultSZM);
router.get('/company/qst', Company.getResultSZMStatus);
router.post('/company/q', Company.getResult);
router.post('/company/ct', Company.create);
router.post('/company/h', Company.hideByID);
router.post('/company/ut', Company.updateById);

//游戏
router.get('/game/qs', Game.getResultSZM);
router.get('/game/qst', Game.getResultSZMStatus);
router.post('/game/q', Game.getResult);
router.post('/game/ct', Game.create);
router.post('/game/h', Game.hideByID);
router.post('/game/ut', Game.updateById);

//平台
router.get('/platform/qs', Platform.getResultSZM);
router.get('/platform/qst', Platform.getResultSZMStatus);
router.post('/platform/q', Platform.getResult);
router.post('/platform/ct', Platform.create);
router.post('/platform/h', Platform.hideByID);
router.post('/platform/ut', Platform.updateById);

//用户
router.post('/user/q', User.getResult);
router.post('/user/ct', User.create);
router.post('/user/h', User.hideByID);
router.post('/user/ut', User.updateById);

//入驻
router.post('/settlein/quid', Settlein.getResultByUserId);
router.get('/settlein/qid', Settlein.findById);
router.get('/settlein/qw', Settlein.getWorkResult);
router.post('/settlein/q', Settlein.getResult);
router.post('/settlein/ct', Settlein.create);
router.post('/settlein/h', Settlein.hideByID);
router.post('/settlein/ut', Settlein.updateById);
router.post('/settlein/excel', Settlein.exportExcel)

//工作
router.post('/work/q', Work.getClearingsBySettleinId);
router.post('/work/ci', Work.clearing);
router.post('/work/qid', Work.tasksById);
router.post('/work/qsid', Work.getWorksBySettleinIDtoInfo);
router.post('/work/ctask', Work.addDailyTask)


module.exports = router