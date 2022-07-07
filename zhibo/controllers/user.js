const User = require('../proxy').User;
const Handling = require('../common').Handling;

const getResult = async (ctx, next) => { 
    let obje = JSON.parse(ctx.request.body);
    let page = parseInt(obje.page) || 1;
    let size = parseInt(obje.size) || 10;
    let query = obje.query || { } ;
    let result = await User.find(page,size,{ 
        query : query,
    });
    ctx.body = result;
} 

const create = async (ctx, next) => { 
    let obje = JSON.parse(ctx.request.body);
    let result = { success :false };
    if( obje ){
        result = await User.create(obje);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    
    ctx.body = result;
} 

const hideByID = async (ctx ,next) => {
    let obje = JSON.parse(ctx.request.body);
    let id = obje.id;
    let result = { success :false };
    if(id){
        result = await User.hideByID(id);
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

const findById = async ( ctx ,next ) => {
    let id = ctx.query.id;
    let result = { success :false }
    if(id){
        result = await User.findById(id)
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

const updateById = async ( ctx ,next ) => {
    let obje = JSON.parse(ctx.request.body);
    let result = { success :false };
    let id = obje.id
    if( id ){
        delete obje.id;
        result = await User.updateById(id ,obje, { new: true });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}


exports.getResult = getResult
exports.create = create
exports.hideByID = hideByID
exports.findById = findById
exports.updateById = updateById