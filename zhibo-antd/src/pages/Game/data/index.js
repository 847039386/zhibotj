import { Divider, Typography } from 'antd';

const settleStatusRadioOptions = [{ label: '日结', value: 0 }, { label: '周结', value: 1 }, { label: '月结', value: 2 }, { label: '季度结', value: 3 }, { label: '半年结', value: 4 }, { label: '年结', value: 5 }]
const reachStatusOptions = [{ label: '天', value: 0 }, { label: '小时', value: 1 }]

const GameFormat = [
    {
        gutter: 24,
        FormItem: [
            {
                span: 12,
                props: {
                    style: { marginBottom: 0 },
                    name: 'name',
                    tooltip: '游戏名称',
                    label: "游戏名称",
                    rules: [{ required: true, message: '请输入游戏名称' }]
                },
                input: {
                    type: 'Input',
                    props: { style: { width: '100%' }, placeholder: "请输入游戏名称" },
                }
            },
            {
                span: 12,
                props: {
                    style: { marginBottom: 0 },
                    name: 'img_url',
                    tooltip: '图片地址可以直接拷贝网上的地址，但是有的网址可能会存在跨域问题，所以复制一些没有跨域的地址就好了',
                    label: "图片地址",
                },
                input: {
                    type: 'Input',
                    props: { style: { width: '100%' }, placeholder: "请输入图片地址" },
                }
            },
        ],
        children: {
            end: <Divider><Typography.Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16 }}>合约</Typography.Text><Typography.Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>达标要求</Typography.Text></Divider>
        },
    },
    {
        gutter: 24,
        FormItem: [
            {
                span: 24,
                props: {
                    style: { marginBottom: 0 },
                    name: 'reach_status',
                    tooltip: '达标状态分为，按天和按小时，按天则每天需直播够小时数，才为达标，而按小时是直播天数之内达到多少小时才算达标',
                    label: "达标状态",
                    rules: [{ required: true, message: '请选择达标状态' }]
                },
                input: {
                    type: 'Radio',
                    props: { options: reachStatusOptions }
                }
            },
        ],
        children: {
            end: <div style={{ margin: '24px 0' }}></div>
        },
    },
    {
        gutter: 24,
        FormItem: [
            {
                span: 12,
                props: {
                    style: { marginBottom: 0 },
                    name: 'play_time',
                    tooltip: '直播时间管理者用户播出的时间是否达到游戏直播时间的标准，会返回给管理员一个是否达标的状态',
                    label: "直播时间",
                    rules: [{ required: true, message: '请输入直播时间' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 24, placeholder: "请输入直播时间" },
                }
            },
            {
                span: 12,
                props: {
                    style: { marginBottom: 0 },
                    name: 'reach_day',
                    tooltip: '达标天数管理着用户的周期播出的时间是否达到结算时间的标准，会返回给管理员一个是否达标的状态',
                    label: "达标天数",
                    rules: [{ required: true, message: '请输入达标天数' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 31, placeholder: "请输入达标天数" },
                }
            },
        ],
        children: {
            end: <Divider><Typography.Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16 }}>状态</Typography.Text><Typography.Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>必选项</Typography.Text></Divider>
        },
    },
    {
        gutter: 24,
        FormItem: [
            {
                span: 24,
                props: {
                    style: { marginBottom: 0 },
                    name: 'settle_status',
                    tooltip: '结算状态',
                    label: "结算状态",
                    extra: '该选项可以提前通知提醒管理员进行结算',
                    rules: [{ required: true, message: '请选择结算状态' }]
                },
                input: {
                    type: 'Radio',
                    props: { options: settleStatusRadioOptions }
                }
            },
        ]
    },
    {
        gutter: 24,
        FormItem: [
            {
                span: 24,
                props: {
                    style: { marginBottom: 0 },
                    name: 'status',
                    tooltip: '游戏状态',
                    label: "游戏状态",
                    valuePropName: "checked",
                    extra: '如果游戏被下架，那么管理员的工作表依然可以管理正在直播本游戏的用户，但是如果游戏被删除，那么工作表将自动筛选没有直播该游戏的工作列表',
                    rules: [{ required: true, message: '请选择游戏状态' }]
                },
                input: {
                    type: 'Switch',
                    props: { style: { width: 80 }, checkedChildren: "上架", unCheckedChildren: "下架" },
                }
            },
        ],
        children: {
            end: <Divider><Typography.Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16 }}>直播价格</Typography.Text><Typography.Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>按每天计算</Typography.Text></Divider>
        },
    },
    {
        gutter: 24,
        FormItem: [
            { span: 2 },
            {
                span: 9,
                props: {
                    style: { marginBottom: 0 },
                    name: 'trial_price',
                    rules: [{ required: true, message: '请输入厂商试用价格' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 999999, addonBefore: "厂商试用价格", addonAfter: "元", placeholder: "请输入价格" },
                }
            },
            { span: 2 },
            {
                span: 9,
                props: {
                    style: { marginBottom: 0 },
                    name: 'formal_price',
                    rules: [{ required: true, message: '请输入厂商转正价格' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 999999, addonBefore: "厂商转正价格", addonAfter: "元", placeholder: "请输入价格" },
                }
            }
        ],
        children: {
            end: <div style={{ margin: '24px 0' }}></div>
        },
    },
    {
        gutter: 24,
        FormItem: [
            { span: 2 },
            {
                span: 9,
                props: {
                    style: { marginBottom: 0 },
                    name: 'custom_trial_price',
                    rules: [{ required: true, message: '请输入公司试用价格' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 999999, addonBefore: "公司试用价格", addonAfter: "元", placeholder: "请输入价格" },
                }
            },
            { span: 2 },
            {
                span: 9,
                props: {
                    style: { marginBottom: 0 },
                    name: 'custom_formal_price',
                    rules: [{ required: true, message: '请输入公司转正价格' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 999999, addonBefore: "公司转正价格", addonAfter: "元", placeholder: "请输入价格" },
                }
            },
        ],
        children: {
            end: <Divider></Divider>
        },
    },
    {
        gutter: 24,
        FormItem: [
            {
                span: 24,
                props: {
                    style: { marginBottom: 0 },
                    name: 'description',
                    tooltip: '备注',
                    label: "备注",
                },
                input: {
                    type: 'TextArea',
                    props: { style: { width: '100%' }, autoSize: { minRows: 5, maxRows: 5 } },
                }
            }
        ]
    }
]

const DefaultGameValues = {
    status: 1,
    reach_status: 0,
    reach_day: 0,      //达标天数
    settle_status: 0,   //结算状态
    trial_price: 0,    //厂商给的价格
    formal_price: 0,    //厂商给的正式工价格
    custom_trial_price: 0,   //自定义的试用期价格
    custom_formal_price: 0,  //自定义的正式工价格
    play_time: 0,      // 直播时间，这里直播时间的意思代表着主播需要播出到这个时间才算是达标。
}


export { GameFormat, DefaultGameValues }