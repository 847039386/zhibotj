import { Divider } from 'antd';

const CompanyFormat = [
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    style : { marginBottom:0 },
                    name : 'name',
                    tooltip :'公司名称',
                    label :"公司" ,
                    rules :[{ required: true, message: '请输入公司名称'}]
                },
                input :{
                    type : 'Input',
                    props : { style : { width :'100%' } ,placeholder:"请输入公司名称"},
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
                    name : 'principal',
                    tooltip :'负责人',
                    label :"负责人" ,
                },
                input :{
                    type : 'Input',
                    props : { style : { width :'100%' } ,placeholder:"请输入负责人姓名"},
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
                    name : 'address',
                    tooltip :'地址',
                    label :"地址" ,
                },
                input :{
                    type : 'Input',
                    props : { style : { width :'100%' } ,placeholder:"请输入公司地址"},
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
                    name : 'iphone',
                    tooltip :'电话',
                    label :"电话" ,
                },
                input :{
                    type : 'Input',
                    props : { style : { width :'100%' } ,placeholder:"请输入电话"},
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
                    tooltip :'公司状态',
                    label :"状态" ,
                    valuePropName:"checked",
                    extra :'如果与公司终止合作，那么工作表将自动筛选掉已终止合作公司的工作列表，与删除一样',
                },
                input :{
                    type : 'Switch',
                    props : { style : { width :80 } ,checkedChildren:"合作中" ,unCheckedChildren:"合作终止"},
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

const DefaultCompanyValues = {
    status :1,
}


export { CompanyFormat ,DefaultCompanyValues}