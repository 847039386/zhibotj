const userSexRadioOptions = [{ label: '男', value: 1 },{ label: '女', value: 0}]

const UserFormat = [
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    name : 'name',
                    label :"姓名" ,
                    rules :[{ required: true, message: '请输入用户姓名'}]
                },
                input :{
                    type : 'Input',
                    placeholder:"请输入用户姓名"
                }
            },
        ]
    },
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    name : 'wx',
                    label :"微信" ,
                },
                input :{
                    type : 'Input',
                    placeholder:"请输入主播微信"
                }
            }
        ]
    },
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    name : 'sex',
                    label :"性别" ,
                },
                input :{
                    type : 'Radio',
                    props : { options:userSexRadioOptions }
                }
            },
        ]
    },
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    name : 'status',
                    label :"状态" ,
                    valuePropName :"checked",
                    extra :'如果用户离职，那么工作表将自动筛选掉已离职用户的工作列表，与删除一样',
                },
                input :{
                    type : 'Switch',
                    props : { style : { width :70 } ,checkedChildren :"在职" ,unCheckedChildren:"离职"},
                }
            }      
        ]
    },
    {
        gutter :24,
        FormItem : [
            { 
                span :24,
                props :{
                    name : 'description',
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

const DefaultUserValues = {
    sex :1,
    status : 1
}


export { UserFormat ,DefaultUserValues}



