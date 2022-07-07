import { Divider } from 'antd';

const PlatformFormat = [
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    style : { marginBottom:0 },
                    name : 'name',
                    tooltip :'平台名称',
                    label :"平台名" ,
                    rules :[{ required: true, message: '请输入平台名称'}]
                },
                input :{
                    type : 'Input',
                    props : { style : { width :'100%' } ,placeholder:"请输入平台名称"},
                }
            },
        ],
        children : {
            end : <div style={{margin:'24px 0'}}></div>
        },
    },
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    style : { marginBottom:0 },
                    name : 'img_url',
                    tooltip :'图片地址',
                    label :"图片地址" ,
                },
                input :{
                    type : 'Input',
                    props : { style : { width :'100%' } ,placeholder:"请输入图片地址"},
                }
            },
        ],
        children : {
            end : <div style={{margin:'24px 0'}}></div>
        },
    },
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    style : { marginBottom:0 },
                    name : 'status',
                    tooltip :'平台状态',
                    label :"平台状态" ,
                    valuePropName:"checked",
                    extra :'如果平台被撤离，那么管理员的工作表依然可以管理在本平台直播的用户，但是如果平台被删除，那么工作表将自动筛选没有掉撤离平台的工作列表',
                },
                input :{
                    type : 'Switch',
                    props : { style : { width :80 } ,checkedChildren:"入驻" ,unCheckedChildren:"撤离"},
                }
            },
        ],
        children : {
            end : <Divider></Divider>
        },
    },
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    style : { marginBottom:0 },
                    name : 'description',
                    tooltip :'备注',
                    label :"备注" ,
                },
                input :{
                    type : 'TextArea',
                    props : { style : { width :'100%' } ,autoSize :{ minRows: 5, maxRows: 5 } },
                }
            }
        ]
    }
]

const DefaultPlatformValues = {
    status :1,
}


export { PlatformFormat ,DefaultPlatformValues}