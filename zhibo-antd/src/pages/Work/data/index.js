import { Divider } from 'antd';
import moment from 'moment';

const WorkFormat = [
    {
        gutter: 24,
        FormItem: [
            {
                span: 8,
                props: {
                    style: { marginBottom: 0 },
                    name: 'dau',
                    tooltip: '场观人数',
                    label: "场观",
                    rules: [{ required: true, message: '请输入场观人数' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 99999999 },
                }
            },
            {
                span: 8,
                props: {
                    style: { marginBottom: 0 },
                    name: 'like',
                    tooltip: '本场点赞数量',
                    label: "点赞",
                    rules: [{ required: true, message: '请输入本场点赞' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 99999999 },
                }
            },
            {
                span: 8,
                props: {
                    style: { marginBottom: 0 },
                    name: 'follow',
                    tooltip: '新增粉丝数量',
                    label: "粉丝",
                    rules: [{ required: true, message: '请输入新增粉丝' }]
                },
                input: {
                    type: 'InputNumber',
                    props: { style: { width: '100%' }, min: 0, max: 99999999 },
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
                span: 12,
                props: {
                    style: { marginBottom: 0 },
                    name: 'work_time',
                    tooltip: '直播时长',
                    label: "直播时长",
                    rules: [{ required: true, message: '请输入直播时长' }]
                },
                input: {
                    type: 'TimePicker',
                    props: { style: { width: '100%' } },
                }
            },
            {
                span: 12,
                props: {
                    style: { marginBottom: 0 },
                    name: 'work_at',
                    tooltip: '工作时间',
                    label: "工作时间",
                    rules: [{ required: true, message: '请输入工作时间' }]
                },
                input: {
                    type: 'DatePicker',
                    props: { style: { width: '100%' } },
                }
            }
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

const initialWorkValues = {
    dau: 0,
    like: 0,
    follow: 0,
    work_time: moment('01:00:00', 'HH:mm:ss'),
    work_at: moment('00:00:00', 'HH:mm:ss')
}


export { WorkFormat, initialWorkValues }