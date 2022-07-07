const config = {
    debug :true,
    authRedirectURL :'http://localhost:3000',                  //这里对应着第三方登陆的回调测试的时候前后端分离是3000上线之后是本站的域名。
    port : 8888,
    db : {
        database : 'bapengkeji',
        host : 'localhost',
        port : 27017
    },
}
module.exports = config;