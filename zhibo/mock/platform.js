const Mock = require('mockjs')
const Random = Mock.Random

exports.Docs = [
    /* 1 */
    {
        "name" : "抖音",
        "img_url" : "https://img.onlinedown.net/download/202204/142755-6268e26bbb41e.jpg",
        "szm" : "D",
        'description' :Random.cparagraph(1,3)
    },
    /* 2 */
    {
        "name" : "虎牙",
        "img_url" : "https://img1.baidu.com/it/u=3095911048,3348083996&fm=253&fmt=auto&app=138&f=JPEG?w=236&h=236",
        "szm" : "H",
        'description' :Random.cparagraph(1,3)
    },
    /* 3 */
    {
        "name" : "斗鱼",
        "img_url" : "https://img0.baidu.com/it/u=2290625809,2970287525&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "szm" : "D",
        'description' :Random.cparagraph(1,3)
    },
    /* 4 */
    {
        "name" : "B站",
        "img_url" : "https://img0.baidu.com/it/u=454330880,3115507849&fm=253&fmt=auto&app=138&f=PNG?w=602&h=500",
        "szm" : "B",
        'description' :Random.cparagraph(1,3)
    }
]

