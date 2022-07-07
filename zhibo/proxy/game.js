const Game = require('../models').Game;
const Settlein = require('../models').Settlein;
const Config = require('../config');

const create = (obje) => {
    let result = { success: false };
    return new Promise((resolve, reject) => {
        Game.create(obje, (err, data) => {
            if (err) {
                resolve(Object.assign(result, { msg: Config.debug ? err.message : '未知错误' }));
            } else {
                resolve(Object.assign(result, { success: true, data: data }));
            }
        })
    });
}

const updateById = (id, obj) => {
    let result = { success: false };
    return new Promise((resolve, reject) => {
        Game.findByIdAndUpdate(id, obj, { new: true }).exec((err, data) => {
            Settlein.update({ game_id: id }, {
                $set: { game_status: obj.status }
            }, { multi: true }).exec((errs) => {
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

const hideByID = (id) => {
    let result = { success: false };
    return new Promise((resolve, reject) => {
        Game.findByIdAndUpdate(id, { show: false, status: 2 }).exec((err, data) => {
            Settlein.update({ game_id: id }, {
                $set: { status: 2, game_status: 2, show: false }
            }, { multi: true }).exec((errs) => {
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

const find = (page, pageSize, options) => {
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let GamesPromise = new Promise((resolve, reject) => {
        Game.find(options.query || {})
            .limit(pageSize || 10)
            .skip(realPage * pageSize)
            .sort({ 'create_at': -1 })
            .exec((err, Games) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(Games)
                }
            })
    });

    let countPromise = new Promise((resolve, reject) => {
        Game.count(options.query || {}).exec((err, count) => {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    });

    return new Promise((resolve, reject) => {
        Promise.all([GamesPromise, countPromise]).then((result) => {
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


const findSZM = (obj) => {
    let result = { success: false }
    return new Promise((resolve, reject) => {
        Game.find(obj || {}).sort({ 'szm': 1 }).exec((err, data) => {
            if (err) {
                resolve(Object.assign(result, { msg: Config.debug ? err.message : '未知错误' }));
            } else {
                resolve(Object.assign(result, { success: true, data: data }));
            }
        })
    })

}



exports.create = create
exports.updateById = updateById
exports.hideByID = hideByID
exports.find = find
exports.findSZM = findSZM