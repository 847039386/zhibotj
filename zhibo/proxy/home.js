const UserModel = require('../models').User;
const WorkModel = require('../models').Work;
const ClearingModel = require('../models').Clearing;
const SettleinModel = require('../models').Settlein;
const async = require('async');
const dayjs = require('dayjs');

const getHomeBaseInformation = () => {
    return new Promise((resolve, reject) => {
        async.parallel([
            function (next) {
                UserModel.aggregate([
                    {
                        $group: {
                            _id: '$sex',
                            count: { $sum: 1 },
                        }
                    },
                    { $sort: { '_id': -1 } },
                ]).then((docs) => {
                    next(null, docs)
                }).catch((err) => { next(err) })
            },
            function (next) {
                WorkModel.aggregate([
                    { $unwind: "$tasks" },
                    {
                        $match:
                        {
                            'tasks.create_at': {
                                $gte: new Date(dayjs().subtract(7, 'days').startOf('day')),
                                $lte: new Date(dayjs().endOf('day'))
                            },
                        }
                    },
                    {
                        $group: {
                            _id: '$user_id',
                            count: { $sum: 1 },
                            dau_sum: { $sum: '$tasks.dau' },
                            like_sum: { $sum: '$tasks.like' },
                            follow_sum: { $sum: '$tasks.follow' },
                        }
                    },
                    { $sort: { 'dau_sum': -1 } },
                    { $limit: 5 },
                    {
                        $lookup: {
                            from: 'User',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },

                ]).then((docs) => {
                    next(null, docs)
                }).catch((err) => {
                    next(err)
                })
            },
            function (next) {
                ClearingModel.aggregate([
                    // {
                    //     $match:
                    //     {
                    //         'create_at': {
                    //             $gte: new Date(dayjs().subtract(30, 'days').startOf('day')),
                    //             $lte: new Date(dayjs().endOf('day'))
                    //         },
                    //     }
                    // },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$create_at" } },
                            count: { $sum: 1 },
                            cost: { $sum: '$cost' },
                            selling_price: { $sum: '$selling_price' },
                            profit: { $sum: '$profit' },
                            prize: { $sum: '$prize' }
                        }
                    },
                    { $sort: { '_id': 1 } },
                    { $limit: 15 },         // 按时间查询改成近多少次结款

                ]).then((docs) => {
                    next(null, docs)
                }).catch((err) => { next(err) })
            },
            function (next) {
                SettleinModel.aggregate([
                    {
                        $group: {
                            _id: '$game_id',
                            count: { $sum: 1 },
                        }
                    },
                    {
                        $lookup: {
                            from: 'Game',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'game'
                        }
                    },
                    { $sort: { 'count': -1 } },
                ]).then((docs) => {
                    next(null, docs)
                }).catch((err) => {
                    next(err)
                })
            },
            function (next) {
                WorkModel.aggregate([
                    {
                        $match:
                        {
                            'status': 0,
                        }
                    },
                    {
                        $lookup: {
                            from: 'Settlein',
                            localField: 'settlein_id',
                            foreignField: '_id',
                            as: 'settlein'
                        }
                    },
                    {
                        $lookup: {
                            from: 'User',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'Company',
                            localField: 'company_id',
                            foreignField: '_id',
                            as: 'company'
                        }
                    },
                    {
                        $match:
                        {
                            'settlein.status': 1,
                        }
                    },
                    // {
                    //     $match:
                    //     {
                    //         'status': 2,
                    //     }
                    // },
                    // {
                    //     $lookup: {
                    //         from: 'Game',
                    //         localField: '_id',
                    //         foreignField: '_id',
                    //         as: 'game'
                    //     }
                    // },
                    { $sort: { 'count': -1 } },
                ]).then((docs) => {
                    next(null, docs)
                }).catch((err) => {
                    next(err)
                })
            },
        ], function (err, results) {
            resolve(results)
        });
    })
}





exports.getHomeBaseInformation = getHomeBaseInformation