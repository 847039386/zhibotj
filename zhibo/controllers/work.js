const Work = require('../proxy').Work;
const WorkModel = require('../models').Work;



// 根据settleinID查询该下列的所以账单
const getClearingsBySettleinId = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    let page = parseInt(obje.page) || 1;
    let size = parseInt(obje.size) || 10;
    let result = await Work.find(page, size, {
        query: { settlein_id: obje.settlein_id },
        select: { tasks: 0 },
        sort: { 'status': 1 }
    });
    ctx.body = result;
}

const tasksById = async (ctx, next) => {
    const obje = JSON.parse(ctx.request.body);
    let work_id = obje._id
    let result = null
    if (work_id) {
        // await WorkModel.findById(work_id).sort({ 'work_at': 1 }).exec((error, docs) => {
        //     if (docs && !error) {
        //         result = { success: true, data: docs }
        //     } else {
        //         result = { success: true, data: { _id: null, tasks: [] } }
        //     }
        // })
        await Work.tasksById(work_id).then((docs) => {
            result = { success: true, datas: docs }
        }).catch((err) => {
            result = { success: false, msg: err.message }
        })

    } else {
        result = { success: false, msg: '无work_id的查询' }
    }

    ctx.body = result;
}

const getWorksBySettleinIDtoInfo = async (ctx, next) => {

    let obje = JSON.parse(ctx.request.body);
    var result = { success: false, msg: '未知错误' }
    await Work.getWorksBySettleinIDtoInfo(obje.work_id).then((data) => {
        result = { success: true, data }
    })
    ctx.body = result;
}



const addDailyTask = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    var settleinOBJ = obje.settlein
    var workOBJ = obje.work
    let result = { success: false };
    if (settleinOBJ._id) {
        result = await Work.addDailyTask(settleinOBJ, workOBJ);
    } else {
        result = Object.assign(result, { msg: '参数不符合规则。' });
    }
    ctx.body = result;
}

const clearing = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    var work = obje.work
    var game = obje.game
    var bill = obje.bill
    let result = { success: false };
    if (work._id) {
        await Work.clearing(work, game, bill).then((docs) => {
            result = { success: true, data: docs }
        }).catch((err) => {
            console.log(err)
            result = Object.assign(result, { msg: err.message })
        });
    } else {
        result = Object.assign(result, { msg: '参数不符合规则。' });
    }
    ctx.body = result;
}

exports.clearing = clearing
exports.tasksById = tasksById
exports.addDailyTask = addDailyTask
exports.getWorksBySettleinIDtoInfo = getWorksBySettleinIDtoInfo
exports.getClearingsBySettleinId = getClearingsBySettleinId