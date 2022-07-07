const Home = require('../proxy').Home;

const getHomeBaseInformation = async (ctx, next) => {
    let result = {}
    await Home.getHomeBaseInformation().then((datas) => {
        result = { success: true, datas }
    }).catch((err) => {
        result = { success: false, msg: err.message }
    })
    ctx.body = result;
}


exports.getHomeBaseInformation = getHomeBaseInformation
