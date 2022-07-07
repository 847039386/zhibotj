const Database = require('./index')

const add = async (ctx, next) => { 
    let result = { success : false } ;
    await Database.add().then((data) => {
        result = { success :true ,data }
    }).catch(err => {
        result = Object.assign(result,{ err })
    })
    ctx.body = result;
} 


exports.add = add

