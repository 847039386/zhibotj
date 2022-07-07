
const Settlein = require('../proxy').Settlein;
const dayjs = require('dayjs')

const getResult = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    let page = parseInt(obje.page) || 1;
    let size = parseInt(obje.size) || 10;
    let query = obje.query || {};
    let result = await Settlein.find(page, size, {
        query: query,
        populate: { path: 'game_id platform_id company_id user_id' },
        sort: { 'next_clearing_time': 1 }
    });
    ctx.body = result;
}

const create = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    let result = { success: false };
    if (obje) {
        result = await Settlein.create(obje);
    } else {
        result = Object.assign(result, { msg: '参数不符合规则。' });
    }

    ctx.body = result;
}

const hideByID = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    let id = obje.id;
    let result = { success: false };
    if (id) {
        result = await Settlein.hideByID(id);
    } else {
        result = Object.assign(result, { msg: '参数不符合规则' })
    }
    ctx.body = result;
}

const findById = async (ctx, next) => {
    let id = ctx.query.id;
    let result = { success: false }
    if (id) {
        result = await Settlein.findById(id)
    } else {
        result = Object.assign(result, { msg: '参数不符合规则' })
    }
    ctx.body = result;
}

const updateById = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    let result = { success: false };
    let id = obje._id
    if (id) {
        delete obje._id;
        result = await Settlein.updateById(id, obje, { new: true });
    } else {
        result = Object.assign(result, { msg: '参数不符合规则。' });
    }
    ctx.body = result;
}

const getResultByUserId = async (ctx, next) => {
    let obje = JSON.parse(ctx.request.body);
    if (obje.uid) {
        result = await Settlein.findByUserId({
            user_id: obje.uid,
        });
    } else {
        result = Object.assign(result, { msg: 'UserId为必传值' });
    }

    ctx.body = result;
}

const getWorkResult = async (ctx, next) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    var today = dayjs().startOf('day')
    let result = await Settlein.find(page, size, {
        query: {
            status: 1,
            user_status: 1,
            company_status: 1,
            game_status: { $lt: 2 },
            platform_status: { $lt: 2 },
            show: true,
            work_at: {
                $lt: today,
            }
        },
        populate: [{ path: 'game_id' }, { path: 'platform_id' }, { path: 'company_id' }, { path: 'user_id' }]
    });
    ctx.body = result;
}

const exportExcel = async (ctx, next) => {
    let result = {}
    let obje = JSON.parse(ctx.request.body);
    await Settlein.exportExcel(obje.startOfDate, obje.endOfDate).then((datas) => {
        result = { success: true, datas }
    }).catch((err) => {
        result = { success: false, msg: err.message }
    })
    ctx.body = result;
}



exports.exportExcel = exportExcel
exports.getResult = getResult
exports.create = create
exports.hideByID = hideByID
exports.findById = findById
exports.updateById = updateById
exports.getResultByUserId = getResultByUserId
exports.getWorkResult = getWorkResult