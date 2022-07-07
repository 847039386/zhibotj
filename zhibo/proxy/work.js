const mongoose = require('mongoose')
const dayjs = require('dayjs')
const Work = require('../models').Work;
const Settlein = require('../models').Settlein
const Clearing = require('../models').Clearing
const Config = require('../config');
const async = require('async')



const find = (page, pageSize, options) => {
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let WorksPromise = new Promise((resolve, reject) => {
        Work.find(options.query || {})
            .select(options.select || {})
            .limit(pageSize || 10)
            .skip(realPage * pageSize)
            .sort(options.sort || { 'create_at': -1 })
            .exec((err, works) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(works)
                }
            })
    });

    let countPromise = new Promise((resolve, reject) => {
        Work.count(options.query || {}).exec((err, count) => {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    });

    return new Promise((resolve, reject) => {
        Promise.all([WorksPromise, countPromise]).then((result) => {
            resolve({
                data: result[0],
                pagination: { total: result[1], current: page || 1, size: pageSize },
                success: true
            })
        }).catch((err) => {
            resolve({ success: false, msg: Config.debug ? err.message : '未知错误' })
        })
    })
}

const ctWorkUtSettlein = function (workObject, settleinObject) {
    let result = { success: false }
    var settlein_id = settleinObject._id
    delete settleinObject._id;
    var work_at = workObject.work_at;
    var work_atms = new Date(work_at).getTime();
    var work_endTime = work_atms + 86400000 - 1;
    const startTime = new Date(work_atms)
    const endTime = new Date(work_endTime)
    return new Promise((resolve, reject) => {
        Work.findOneAndUpdate({
            settlein_id: settlein_id,
            work_at: {
                $gte: startTime,
                $lte: endTime
            }
        }, workObject, { upsert: true, new: true, setDefaultsOnInsert: true }).exec((err, data) => {
            Settlein.findByIdAndUpdate(settlein_id, settleinObject, { new: true }).exec((errs) => {
                if (err) {
                    resolve(Object.assign(result, { msg: Config.debug ? err.message : '未知错误' }));
                } else if (errs) {
                    resolve(Object.assign(result, { msg: Config.debug ? errs.message : '未知错误' }));
                } else {
                    resolve(Object.assign(result, { success: true, data: data }));
                }
            })
        })
    })
}


const getWorksBySettleinIDtoInfo = async (work_id) => {

    return new Promise((resolve, reject) => {
        async.parallel([
            function (next) {
                Work.aggregate([
                    { $unwind: "$tasks" },
                    { $match: { _id: mongoose.Types.ObjectId(work_id) } },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            dau_sum: { $sum: '$tasks.dau' },
                            like_sum: { $sum: '$tasks.like' },
                            follow_sum: { $sum: '$tasks.follow' },
                            dau_avg: { $avg: '$tasks.dau' },
                            like_avg: { $avg: '$tasks.like' },
                            follow_avg: { $avg: '$tasks.follow' },
                        }
                    },
                ]).then((docs) => {
                    next(null, { total: docs[0] })
                }).catch((err) => { next(err) })
            },
            function (next) {
                Work.findById(work_id).populate('game_id').exec((err, work) => {
                    if (!err) {
                        next(null, work)
                    } else {
                        next(err)
                    }

                })
            }
        ], function (err, results) {
            if (results && results.length > 0) {
                if (results[0].total) {
                    resolve({ bill: results[0].total, work: results[1] })
                } else {
                    resolve({ bill: { count: 0, dau_avg: 0, dau_sum: 0, follow_avg: 0, follow_sum: 0, like_avg: 0, like_sum: 0, }, work: results[1] })
                }

            }
            resolve(results)
        });
    })
}


const tasksById = (work_id) => {
    return new Promise((resolve, reject) => {
        Work.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(work_id) } },
            { $unwind: "$tasks" },
            { $project: { 'tasks.create_at': 1, 'tasks.dau': 1, 'tasks.follow': 1, 'tasks.like': 1, } },
            { $sort: { 'tasks.create_at': 1 } },
        ]).then((docs) => {
            resolve(docs)
        }).catch((err) => {
            reject(err)
        })
    })
}




/**
 * 像works数组中添加一条工作信息。在settlein创建的时候会自动像Work里添加一条链接settlein表ID的数据。
 * 他的结算状态必定是0（未清算）以后也绝对会只有一条是未清算，所以会用findOne方法查询并添加
 * @param {*} obje 
 * @returns 
 */
const addDailyTask = (settlein, workObject) => {
    var result = { success: true }
    return new Promise((resolve, reject) => {
        Work.findOneAndUpdate({ settlein_id: settlein._id, status: 0 }, {}, { upsert: true, }, function (err, docs) {
            let task_id = null
            var work_create_at = new Date(workObject.work_at).getTime()
            if (!err) {
                if (docs && docs.tasks.length > 0) {
                    var tasks = docs.tasks
                    for (let i = 0; i < tasks.length; i++) {
                        var work_startOf = new Date(dayjs(tasks[i].create_at).startOf('day')).getTime()
                        var work_endOf = new Date(dayjs(tasks[i].create_at).endOf('day')).getTime()
                        if (work_create_at >= work_startOf && work_create_at <= work_endOf) {
                            task_id = tasks[i]._id
                            break
                        }
                    }
                }
                if (task_id) {
                    // 今日没已经添加了日程 就修改tasks数组里已经添加的数据
                    Work.update({ settlein_id: settlein._id, status: 0, 'tasks._id': task_id }, {
                        $set: {
                            'tasks.$': {
                                dau: workObject.dau, // 今日场观
                                like: workObject.like, //今日点赞
                                follow: workObject.follow,//今日关注 
                                work_time: workObject.work_time, // 今日工作时间
                                contract_status: workObject.contract_status,  //合约状态 从入驻表里获得
                                description: workObject.description, //备注
                                create_at: workObject.work_at, // 当前数据添加的时间
                            }
                        }
                    }, {}, function (erro, arra) {
                        if (!erro) {
                            resolve(Object.assign(result, { success: true, data: arra }));
                        } else {
                            resolve(Object.assign(result, { msg: '未知错误' }));
                        }
                    })
                } else {
                    // 今日没添加工作日程 就往tasks数组里添加
                    Work.update({ settlein_id: settlein._id, status: 0 }, {
                        $push: {
                            'tasks': {
                                dau: workObject.dau, // 今日场观
                                like: workObject.like, //今日点赞
                                follow: workObject.follow,//今日关注 
                                work_time: workObject.work_time, // 今日工作时间
                                contract_status: workObject.contract_status,  //合约状态 从入驻表里获得
                                description: workObject.description, //备注
                                create_at: workObject.work_at, // 当前数据添加的时间
                            }
                        }
                    }, {}, function (erro, arra) {
                        if (!erro) {
                            Settlein.findByIdAndUpdate(settlein._id, { contract_status: workObject.contract_status, work_at: workObject.work_at }, { new: true }).exec((errs, settleinData) => {
                                if (!errs) {
                                    resolve(Object.assign(result, { success: true, data: { settlein: settleinData, work: arra } }));
                                } else {
                                    resolve(Object.assign(result, { msg: errs.message }));
                                }
                            })
                        } else {
                            resolve(Object.assign(result, { msg: '未知错误' }));
                        }

                    })
                }

            }
        })
    });
}

/**
 * 结算
 */
const clearing = (work, game, bill) => {
    return new Promise((resolve, reject) => {
        // 结算的时候先看他目前有没有任务，如没有将禁止结算
        Work.findById(work._id).select('tasks').exec((ferr, fwork) => {
            if (!ferr) {
                const tasksLength = fwork.tasks.length
                if (tasksLength > 0) {
                    // 如果有任务那把该工作状态改为1，证明已清算
                    Work.findByIdAndUpdate({ _id: work._id }, {
                        status: 1,        //修改状态变为1 已清算
                        end_of_time: dayjs().endOf('day'),  //结算时间改为今天的23:59:59
                        history: {                          //保存历史的游戏价格数据
                            name: game.name,
                            // 价格
                            trial_price: game.trial_price,
                            formal_price: game.formal_price,
                            custom_trial_price: game.custom_trial_price,
                            custom_formal_price: game.custom_formal_price,
                            // 约定
                            reach_day: game.custom_formal_price,
                            play_time: game.play_time,
                            settle_status: game.settle_status,
                            reach_status: game.reach_status
                        }
                    }).exec((err, oldWork) => {
                        // 创建一个新的工单
                        if (!err) {
                            Work.create({
                                // 必填
                                platform_id: oldWork.platform_id,
                                settlein_id: oldWork.settlein_id,
                                company_id: oldWork.company_id,
                                game_id: oldWork.game_id,
                                user_id: oldWork.user_id,
                                start_of_time: dayjs().add(1, 'day').startOf('day'),   //添加新的结算清单。并将开始时间设置成明天的00:00:00
                            }, (errCt, newWork) => {
                                // 创建历史账单
                                Clearing.create({
                                    work_id: work._id,
                                    platform_id: oldWork.platform_id,
                                    settlein_id: oldWork.settlein_id,
                                    company_id: oldWork.company_id,
                                    game_id: oldWork.game_id,
                                    user_id: oldWork.user_id,
                                    cost: bill.cost || 0,    //成本价
                                    selling_price: bill.selling_price || 0,    //售价
                                    profit: bill.profit || 0,   //利润
                                    prize: bill.prize || 0      //奖金  
                                }, function (errCtclearing, clearing) {
                                    if (!errCtclearing) {
                                        // 然后修改对应的入驻ID 将他的结算时间改为最新
                                        if (!errCt) {
                                            Settlein.findByIdAndUpdate(oldWork.settlein_id, {
                                                clearing_start_time: dayjs().endOf('day'),
                                                next_clearing_time: nextClearing(game.settle_status)
                                            }).exec((utseErr, settleinData) => {
                                                if (!utseErr) {
                                                    resolve({ work: newWork, settlein: settleinData })
                                                } else {
                                                    reject(utseErr)
                                                }
                                            })
                                        } else {
                                            reject(errCt)
                                        }
                                    } else {
                                        reject(errCtclearing)
                                    }
                                })
                            })
                        } else {
                            reject(err)
                        }
                    })
                } else {
                    reject({ message: '该账单无任何任务，不允许结算' })
                }
            } else {
                reject(ferr)
            }
        })
    })
}

exports.find = find
exports.tasksById = tasksById
exports.clearing = clearing
exports.addDailyTask = addDailyTask
exports.ctWorkUtSettlein = ctWorkUtSettlein
exports.getWorksBySettleinIDtoInfo = getWorksBySettleinIDtoInfo


const nextClearing = (state) => {
    if (state === 0) {
        return dayjs().add(1, 'day').endOf('day')
    } else if (state === 1) {
        return dayjs().add(7, 'day').endOf('day')
    } else if (state === 2) {
        return dayjs().add(30, 'day').endOf('day')
    } else if (state === 3) {
        return dayjs().add(90, 'day').endOf('day')
    } else if (state === 4) {
        return dayjs().add(180, 'day').endOf('day')
    }
    return dayjs().add(360, 'day').endOf('day')
}

