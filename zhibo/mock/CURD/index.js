const async = require('async');
const dayjs = require('dayjs');
const Mock = require('mockjs');
const lodash = require('lodash')

const Company = require('../company')
const Game = require('../game')
const Platform = require('../platform')
const User = require('../user')

const CompanyModel = require('../../models').Company
const GameModel = require('../../models').Game
const PlatformModel = require('../../models').Platform
const UserModel = require('../../models').User
const SettleinModel = require('../../models').Settlein
const WorkProxy = require('../../proxy').Work
const SettleinProxy = require('../../proxy').Settlein

const createUser = function (callback) {
    async.map(User.Docs, function (item, next) {
        UserModel.create(item, (err, docs) => {
            if (!err) {
                next(null, docs);
            } else {
                next(err.message);
            }
        })
    }, function (err, result) {
        if (!err) {
            callback(null, result)
        } else {
            callback(err)
        }
    });
}

const createCompany = function (callback) {
    async.map(Company.Docs, function (item, next) {
        CompanyModel.create(item, (err, docs) => {
            if (!err) {
                next(null, docs);
            } else {
                next(err.message);
            }
        })
    }, function (err, result) {
        if (!err) {
            callback(null, result)
        } else {
            callback(err)
        }
    });
}

const createPlatform = function (callback) {
    async.map(Platform.Docs, function (item, next) {
        PlatformModel.create(item, (err, docs) => {
            if (!err) {
                next(null, docs);
            } else {
                next(err.message);
            }
        })
    }, function (err, result) {
        if (!err) {
            callback(null, result)
        } else {
            callback(err)
        }
    });
}

const createGame = function (callback) {
    async.map(Game.Docs, function (item, next) {
        GameModel.create(item, (err, docs) => {
            if (!err) {
                next(null, docs);
            } else {
                next(err.message);
            }
        })
    }, function (err, result) {
        if (!err) {
            callback(null, result)
        } else {
            callback(err)
        }
    });
}

const createWork = function (settlein, callback) {
    const count = 31
    let today = dayjs().subtract(5, 'days')
    async.times(count, function (index, next) {
        today = today.subtract(1, 'days')
        WorkProxy.addDailyTask(settlein, {
            dau: lodash.random(2000, 3000), // 场观
            like: lodash.random(3000, 5000), //今日点赞
            follow: lodash.random(1000, 1500),//今日关注 
            work_time: lodash.random(1 * 60 * 60, 6 * 60 * 60), //工作时间 单位 秒。
            work_at: today,  //工作时间天
            description: Mock.Random.cparagraph(1, 3), //备注,
            contract_status: lodash.random(0, 1),
            create_ut: today
        }).then((docs) => {
            next(null, docs);
        }).catch((err) => {
            next(err);
        })
    }, function (err, result) {
        if (!err) {
            callback(null, result)
        } else {
            callback(err)
        }
    });
}


// 随机添加入Work表信息
const randomWork = (dataSource, callback) => {
    async.map(dataSource, function (item, next) {
        createWork({ _id: item._id }, (err, docs) => {
            if (!err) {
                next(null, docs)
            } else {
                next(err)
            }
        })
    }, function (err, result) {
        if (!err) {
            callback(null, result)
        } else {
            callback(err)
        }
    });
}



// 随机添加入驻信息
const randomSettlein = (dataSource, callback) => {
    const user = dataSource.user
    const company = dataSource.company
    const platform = dataSource.platform
    const game = dataSource.game
    async.map(user, function (item, next) {
        SettleinProxy.create({
            // 选填
            platform_key: Mock.Random.id(),
            platform_name: Mock.Random.cname(),
            game_key: Mock.Random.id(),
            game_name: Mock.Random.name(),
            description: Mock.Random.cparagraph(1, 3),
            //必填
            user_id: item._id,
            platform_id: platform[lodash.random(platform.length - 1)]._id,
            company_id: company[lodash.random(company.length - 1)]._id,
            game_id: game[lodash.random(game.length - 1)]._id,
            // 非必填，但测试用
            clearing_start_time: dayjs(),
            create_at: dayjs(),
            contract_status: lodash.random(0, 1),
            work_at: dayjs().subtract(1, 'days')
        }).then((res) => {
            if (res && res.success) {
                const settleinDocs = res.data.settlein
                next(null, settleinDocs)
            } else {
                next({ err: { msg: 'error' } })
            }
        })
    }, function (err, result) {
        if (!err) {
            callback(null, result)
        } else {
            callback(err)
        }
    });
}

// mock数据添加
exports.add = function () {
    return new Promise((resolve, reject) => {
        async.parallel({
            user: async.apply(createUser),
            company: async.apply(createCompany),
            platform: async.apply(createPlatform),
            game: async.apply(createGame)
        }, function (err, results) {
            if (!err) {
                randomSettlein(results, (serr, docs) => {
                    if (!serr) {
                        randomWork(docs, function (errWork, workResult) {
                            resolve(Object.assign(results, { settlein: docs }))
                        })
                    } else {
                        reject(err)
                    }
                })
            } else {
                reject(err)
            }
        });
    })
}













