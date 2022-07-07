const Mock = require('mockjs')
const Random = Mock.Random

exports.Docs = [
    /* 1 */
    {
        "name": "原神",
        "img_url": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload-bbs.mihoyo.com%2Fupload%2F2021%2F10%2F05%2F82007932%2F033374c6d21cdf746857330b0e734351_3959058359641385670.jpg&refer=http%3A%2F%2Fupload-bbs.mihoyo.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658961082&t=a45b701ad0110d224791f30cc8b0a106",
        "szm": "Y",
        'description': Random.cparagraph(1, 3),
        'reach_day': 1,      //达标天数
        'settle_status': 0,   //结算状态
        'trial_price': 300,    //厂商给的价格
        'formal_price': 700,    //厂商给的正式工价格
        'custom_trial_price': 150,   //自定义的试用期价格
        'custom_formal_price': 500,  //自定义的正式工价格
        'play_time': 4,      // 直播时间，这里直播时间的意思代表着主播需要播出到这个时间才算是达标。
        'reach_status': 0,
    },
    /* 2 */
    {
        "name": "梦幻西游",
        "img_url": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fis3-ssl.mzstatic.com%2Fimage%2Fthumb%2FPurple62%2Fv4%2Fcc%2F0a%2Fdb%2Fcc0adb46-edae-b069-1973-03907ec93eac%2Fsource%2F1024x1024bb.jpg&refer=http%3A%2F%2Fis3-ssl.mzstatic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658961129&t=11695e3949d80bf5c2a6f6cd46da6c40",
        "szm": "M",
        'description': Random.cparagraph(1, 3),
        'reach_day': 7,
        'settle_status': 1,
        'trial_price': 500,
        'formal_price': 700,
        'custom_trial_price': 300,
        'custom_formal_price': 600,
        'play_time': 4,
        'reach_status': 0,
    },
    /* 3 */
    {
        "name": "一念逍遥",
        "img_url": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.symao.com%2Fwp-content%2Fuploads%2F2021%2F04%2F25090405rrdy.png&refer=http%3A%2F%2Fwww.symao.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658961163&t=73fff2102b0d268fc906693b459bddc1",
        "szm": "Y",
        'description': Random.cparagraph(1, 3),
        'reach_day': 30,
        'settle_status': 2,
        'trial_price': 450,
        'formal_price': 800,
        'custom_trial_price': 300,
        'custom_formal_price': 600,
        'play_time': 4,
        'reach_status': 0,
    },
    /* 4 */
    {

        "name": "斗罗大陆",
        "img_url": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2.40407.com%2Fupload%2F202111%2F23%2F231259462eb0akbzw7tZLJCeqmk.jpg&refer=http%3A%2F%2Fimg2.40407.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658961212&t=2f52969df7c194e101b7fdfc6974a1c0",
        "show": true,
        "szm": "D",
        'description': Random.cparagraph(1, 3),
        'reach_day': 30,
        'settle_status': 3,
        'trial_price': 20,
        'formal_price': 50,
        'custom_trial_price': 10,
        'custom_formal_price': 40,
        'play_time': 60,
        'reach_status': 1,
    },
    /* 5 */
    {
        "name": "山海经",
        "img_url": "https://img2.baidu.com/it/u=2649319395,3566354441&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        "szm": "S",
        'description': Random.cparagraph(1, 3),
        'reach_day': 30,
        'settle_status': 4,
        'trial_price': 20,
        'formal_price': 40,
        'custom_trial_price': 10,
        'custom_formal_price': 26,
        'play_time': 120,
        'reach_status': 1,
    }
]