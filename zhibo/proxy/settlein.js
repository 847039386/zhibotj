const Settlein = require('../models').Settlein;
const Work = require('../models').Work;
const dayjs = require('dayjs')

const create = (obje) => {
    let result = { success: false };
    return new Promise((resolve, reject) => {
        Settlein.create(obje, (err, data) => {
            if (!err) {
                Work.create({
                    settlein_id: data._id,
                    company_id: data.company_id,
                    game_id: data.game_id,
                    user_id: data.user_id,
                    platform_id: data.platform_id,
                    start_of_time: data.clearing_start_time,
                }, (errcWork, workDocs) => {
                    // console.log('clearingData', clearingData._id)
                    if (!errcWork) {
                        resolve(Object.assign(result, { success: true, data: { settlein: data, work: workDocs } }));
                    } else {
                        resolve(Object.assign(result, { msg: 'clearing出现问题' }));
                    }
                })
            } else {
                resolve(Object.assign(result, { msg: err.message }));
            }
        })
    });
}

const updateById = (id, obj) => {
    let result = { success: false };
    return new Promise((resolve, reject) => {
        Settlein.findByIdAndUpdate(id, obj, { new: true }).exec((err, data) => {
            if (err) {
                resolve(Object.assign(result, { msg: err.message }));
            } else {
                resolve(Object.assign(result, { success: true, data: data }));
            }
        })
    })
}

const hideByID = (id) => {
    let result = { success: false };
    return new Promise((resolve, reject) => {
        Settlein.findByIdAndUpdate(id, { show: false, status: 2 }).exec((err, data) => {
            if (err) {
                resolve(Object.assign(result, { msg: err.message }));
            } else {
                resolve(Object.assign(result, { success: true, data: data }));
            }
        })
    })
}

const find = (page, pageSize, options) => {
    let result = { success: false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let SettleinPromise = new Promise((resolve, reject) => {
        Settlein.find(options.query || {})
            .limit(pageSize || 10)
            .skip(realPage * pageSize)
            .select(options.select || '')
            .populate(options.populate || '')
            .sort(options.sort || { 'create_at': -1 })
            .exec((err, Settleins) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(Settleins)
                }
            })
    });

    let countPromise = new Promise((resolve, reject) => {
        Settlein.count(options.query || {}).exec((err, count) => {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    });

    return new Promise((resolve, reject) => {
        Promise.all([SettleinPromise, countPromise]).then((result) => {
            resolve({
                data: result[0],
                pagination: { total: result[1], current: page || 1, size: pageSize },
                success: true
            })
        }).catch((err) => {
            resolve({ success: false, msg: err.message })
        })
    })

}
const findByUserId = (options) => {
    let result = { success: false }
    return new Promise((resolve, reject) => {
        Settlein.find(options)
            .populate({ path: 'company_id platform_id game_id user_id' })
            .exec((err, data) => {
                if (err) {
                    resolve(Object.assign(result, { msg: err.message }));
                } else {
                    resolve(Object.assign(result, { success: true, data: data }));
                }
            })
    })
}

const findById = (id, options) => {
    options = options || {};
    return new Promise((resolve, reject) => {
        Settlein.findById(id)
            .populate(options.populate || '')
            .select(options.select || '')
            .exec((err, data) => {
                if (err) {
                    resolve({ success: false, msg: err.message })
                } else {
                    resolve({ success: true, data: data })
                }
            })
    })
}

const exportExcel = (startOfDate, endOfDate) => {
    console.log(startOfDate, endOfDate)
    return new Promise((resolve, reject) => {
        Work.aggregate([
            { $match: { status: 0, } },
            { $unwind: "$tasks" },

            {
                $lookup: {
                    from: 'Settlein',
                    localField: 'settlein_id',
                    foreignField: '_id',
                    as: 'settlein'
                }
            },
            {
                $match:
                {
                    'settlein.status': 1,
                }
            },
            {
                $match:
                {
                    'tasks.create_at': {
                        $gte: new Date(startOfDate) || new Date(dayjs().subtract(7, 'days').startOf('day')),
                        $lte: new Date(endOfDate) || new Date(dayjs().endOf('day'))
                    },
                }
            },
            {
                $group: {
                    _id: '$settlein_id',
                    tasks: { $addToSet: '$tasks' },
                    user: { $addToSet: '$user_id' },
                    game: { $addToSet: '$game_id' },
                    company: { $addToSet: '$company_id' },
                    platform: { $addToSet: '$platform_id' },
                    settlein: { $addToSet: '$settlein_id' },
                    dau_sum: { $sum: '$tasks.dau' },
                    like_sum: { $sum: '$tasks.like' },
                    follow_sum: { $sum: '$tasks.follow' },
                    dau_avg: { $avg: '$tasks.dau' },
                    like_avg: { $avg: '$tasks.like' },
                    follow_avg: { $avg: '$tasks.follow' },
                }
            },
            { $lookup: { from: 'User', localField: 'user', foreignField: '_id', as: 'user' } },
            { $lookup: { from: 'Game', localField: 'game', foreignField: '_id', as: 'game' } },
            { $lookup: { from: 'Company', localField: 'company', foreignField: '_id', as: 'company' } },
            { $lookup: { from: 'Platform', localField: 'platform', foreignField: '_id', as: 'platform' } },
            { $lookup: { from: 'Settlein', localField: 'settlein', foreignField: '_id', as: 'settlein' } },

        ]).then((docs) => {
            resolve(docs)
        }).catch((err) => {
            reject(err)
        })
    })
}

exports.exportExcel = exportExcel
exports.create = create
exports.updateById = updateById
exports.hideByID = hideByID
exports.find = find
exports.findByUserId = findByUserId
exports.findById = findById