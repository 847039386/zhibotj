
const Platform = require('../proxy').Platform;
const Handling = require('../common').Handling;


const getResult = async (ctx, next) => { 
    let obje = JSON.parse(ctx.request.body);
    let page = parseInt(obje.page) || 1;
    let size = parseInt(obje.size) || 10;
    let query = obje.query || { } ;
    let result = await Platform.find(page,size,{ 
        query : query,
    });
    ctx.body = result;
} 

const getResultSZM = async (ctx, next) => { 
    let result = await Platform.findSZM({show : true});
    ctx.body = result;
} 

const getResultSZMStatus = async (ctx, next) => { 
    let result = await Platform.findSZM({ status : 1 ,show : true});
    ctx.body = result;
} 


const create = async (ctx, next) => { 
    let obje = JSON.parse(ctx.request.body);
    let result = { success :false };
    if( obje ){
        result = await Platform.create(obje);
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
        result = await Platform.hideByID(id);
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

const findById = async ( ctx ,next ) => {
    let id = ctx.query.id;
    let result = { success :false }
    if(id){
        result = await Platform.findById(id)
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
        result = await Platform.updateById(id ,obje, { new: true });
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
exports.getResultSZM = getResultSZM
exports.getResultSZMStatus =getResultSZMStatus