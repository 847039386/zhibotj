
import React from 'react';
import moment from 'moment';
import { Area, measureTextWidth, Pie } from '@ant-design/charts';
import { StatisticCard, ModalForm } from '@ant-design/pro-components';
import { Divider, Typography, Row, Col, Table, Button, Collapse, Tooltip, Empty, InputNumber, Form } from 'antd';
import { WorkServices } from '../../../../services';
import Tools from '../../../../utils/tools'
const { Paragraph, Text } = Typography;

const columnsAllReachDays = [
    { title: '工作时间', align: 'center', render: (record) => (<Text>{moment(record.create_at).format("YYYY/MM/DD")}</Text>) },
    { title: '时长', align: 'center', render: (record) => (<Text>{Tools.getDateByTime(record.work_time * 1000)}</Text>) },
    { title: '合同状态', align: 'center', render: (record) => (record.contract_status === 1 ? <Text strong style={{ color: '#52c41a' }}>正式工</Text> : <Text strong style={{ color: '#ff4d4f' }}>试用期</Text>) },
    { title: '价格', align: 'center', render: (record) => (<Text style={{ color: '#1890ff' }}>{record.contract_status === 1 ? Math.floor(record.game.formal_price * (record.work_time / 60 / 60)) : Math.floor(record.game.trial_price * (record.work_time / 60 / 60))}</Text>) },
];

const columnsReachDays = [
    { title: '工作时间', align: 'center', render: (record) => (<Text>{moment(record.create_at).format("YYYY/MM/DD")}</Text>) },
    { title: '时长', align: 'center', render: (record) => (<Text>{Tools.getDateByTime(record.work_time * 1000)}</Text>) },
    { title: '合同状态', align: 'center', render: (record) => (record.contract_status === 1 ? <Text strong style={{ color: '#52c41a' }}>正式工</Text> : <Text strong style={{ color: '#ff4d4f' }}>试用期</Text>) },
    { title: '价格', align: 'center', render: (record) => (<Text><Text style={{ color: '#1890ff' }}>{record.contract_status === 1 ? record.game.formal_price : record.game.trial_price}</Text></Text>) },
];

const columnsNotReachDays = [
    { title: '工作时间', align: 'center', render: (record) => (<Text>{moment(record.create_at).format("YYYY/MM/DD")}</Text>) },
    { title: '合同状态', align: 'center', render: (record) => (record.contract_status === 1 ? <Text strong style={{ color: '#52c41a' }}>正式工</Text> : <Text strong style={{ color: '#ff4d4f' }}>试用期</Text>) },
    { title: '时长', align: 'center', render: (record) => (<Text>{Tools.getDateByTime(record.work_time * 1000)}</Text>) },
];



export default class SettleinInfo extends React.Component {
    constructor(props) {
        super(props)
        // this.state = { daus: [], settlein: {} }
        this.state = {
            loading: true,
            settlein: props.settlein,
            work: props.work,
            daus: [], bill: {}, pieConfig: {},
            initialValues: { prize: 0 },
            visibleModalForm: false
        }
    }

    componentDidMount = () => {
        var _this = this
        if (this.state.settlein && this.state.settlein._id) {
            var settlein_id = this.state.settlein._id
            _this.getWorksInfo({ _id: settlein_id })
        }
    }


    getWorksInfo = async (settlein) => {
        const _this = this
        await WorkServices.qid({ _id: this.state.work._id }, async (res) => {
            if (res && res.success) {
                var daus = []
                res.datas.map((item, index) => {
                    daus.push({ lable: '当日场观', value: item.tasks.dau, date: moment(item.tasks.create_at).format('M/D') })
                    daus.push({ lable: '新增粉丝', value: item.tasks.follow, date: moment(item.tasks.create_at).format('M/D') })
                    daus.push({ lable: '当日点赞', value: item.tasks.like, date: moment(item.tasks.create_at).format('M/D') })
                    return item;
                })
                _this.getWorkInfoBYSettlein(settlein._id, this.state.work._id, function (docs) {
                    if (docs && docs.data && docs.data.reach_day && docs.data.reach_day && docs.data.reach_day.length > 0) {
                        var not_reach_arr = []
                        docs.data.reach_day.map((item) => {
                            if (item.tasks.contract_status === 0) {
                                not_reach_arr.push({
                                    day: item.tasks.create_at,
                                    work_time: item.tasks.work_time,
                                })
                            }
                            return item
                        })
                    }
                    const bill = Object.assign(Tools.getBill(docs.data.work), { info: docs.data.bill })
                    console.log(bill)
                    _this.setState({ bill, daus, info: docs.data.bill, pieConfig: pieConfig(getPieData(bill)), loading: false })
                })
            }
        })
    }

    clearing = () => {
        const _this = this
        const game = this.state.settlein.game_id
        const work = this.state.work
        const bill = this.state.bill
        WorkServices.ci({ game, work, bill }, function (res) {
            if (res) {
                _this.setState({ work: Object.assign(_this.state.work, { status: 1 }) })
                if (_this.props.onClearingSuccess) {
                    _this.props.onClearingSuccess()
                }
            }
        })
    }



    getWorkInfoBYSettlein = (settlein_id, work_id, callback) => {
        WorkServices.qsid({ settlein_id, work_id }, function (data) {
            callback(data)
        })
    }

    onOpenModalForm = () => {
        this.setState({ visibleModalForm: true })
    }

    onCloseModalForm = () => {
        this.setState({ visibleModalForm: false })
    }

    onClearingFinish = (data) => {
        console.log(data)
        const _this = this
        const game = this.state.settlein.game_id
        const work = this.state.work
        let bill = this.state.bill
        bill = Object.assign(bill, { prize: data.prize })
        WorkServices.ci({ game, work, bill }, function (res) {
            if (res) {
                _this.setState({ visibleModalForm: false, work: Object.assign(_this.state.work, { status: 1 }) })
                if (_this.props.onClearingSuccess) {
                    _this.props.onClearingSuccess()
                }
            }
        })
    }

    render() {
        return (
            !this.state.loading ?
                <Typography >
                    <Paragraph style={{ backgroundColor: '#FFFFFF', padding: 24, }}>
                        <Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 18 }}>详情信息</Text>
                        <Text copyable type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>编号:{this.state.settlein._id}</Text>
                        <Text strong italic type='secondary' style={{ marginLeft: 30, fontSize: 12, }}>达标类型：<Text type='danger'>{this.state.bill.game.reach_status === 0 ? '天' : '小时'}</Text></Text>
                        <Button disabled={this.state.work.status === 1} onClick={this.onOpenModalForm} type="primary" style={{ float: 'right' }}>
                            {this.state.work.status === 1 ? '已结算' : '结算'}
                        </Button>
                    </Paragraph>
                    <Paragraph style={{ padding: '0 24px', }}>
                        <ReachDayTitle bill={this.state.bill} />
                    </Paragraph>
                    <Paragraph style={{ padding: '0 24px', }}>
                        <StatisticCard.Group direction={'row'}>
                            <StatisticCard
                                statistic={{
                                    title: `平均${this.state.bill.info.count}天 / 总场观 `,
                                    title: `平均${this.state.bill.info.count}天 / 总场观 `,
                                    value: `${numConvert(Math.floor(this.state.bill.info.dau_avg))} /  ${numConvert(this.state.info.dau_sum)}`,
                                }}
                            />
                            <Divider style={{ height: 80, marginTop: 10 }} type={'vertical'} />
                            <StatisticCard
                                statistic={{
                                    title: `平均${this.state.bill.info.count}天 / 总赞数 `,
                                    title: `平均${this.state.bill.info.count}天 / 总赞数 `,
                                    value: `${numConvert(Math.floor(this.state.bill.info.like_avg))} / ${numConvert(this.state.bill.info.like_sum)}`,
                                }}
                            />
                            <Divider style={{ height: 80, marginTop: 10 }} type={'vertical'} />
                            <StatisticCard
                                statistic={{
                                    title: `平均${this.state.bill.info.count}天 / 总粉丝 `,
                                    title: `平均${this.state.bill.info.count}天 / 总粉丝 `,
                                    value: `${numConvert(Math.floor(this.state.bill.info.follow_avg))} / ${numConvert(this.state.bill.info.follow_sum)}`,
                                }}
                            />
                        </StatisticCard.Group>
                    </Paragraph>
                    <Paragraph style={{ padding: '0 24px', }}>
                        {
                            this.state.bill.count > 0 ?
                                <Row gutter={16}>
                                    <Col span={12} >
                                        <StatisticCard title="流量增长趋势" tip="最近31天增长趋势" chart={<Area limitInPlot={false} data={this.state.daus} xField='date' yField='value' seriesField='lable' />} />
                                    </Col>
                                    <Col span={12} >
                                        <StatisticCard title="价格占比" tip={
                                            <Tooltip>
                                                <Typography style={{ padding: 10, cursor: 'pointer' }}>
                                                    <Paragraph>
                                                        <ul style={{ marginLeft: 0 }}>
                                                            <li style={{ color: '#FFFFFF' }}><Text style={{ color: '#FFFFFF' }}>厂商试用期：{this.state.bill.game.trial_price}<Text style={{ margin: '0 5px', color: '#FFFFFF' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text></li>
                                                            <li style={{ color: '#FFFFFF' }}><Text style={{ color: '#FFFFFF' }}>厂商正式工：{this.state.bill.game.formal_price}<Text style={{ margin: '0 5px', color: '#FFFFFF' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text></li>
                                                            <li style={{ color: '#FFFFFF' }}><Text style={{ color: '#FFFFFF' }}>自定试用期：{this.state.bill.game.custom_trial_price}<Text style={{ margin: '0 5px', color: '#FFFFFF' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text></li>
                                                            <li style={{ color: '#FFFFFF' }}><Text style={{ color: '#FFFFFF' }}>自定正式工：{this.state.bill.game.custom_formal_price}<Text style={{ margin: '0 5px', color: '#FFFFFF' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text></li>
                                                        </ul>
                                                    </Paragraph>
                                                </Typography>
                                            </Tooltip>
                                        } chart={<Pie {...this.state.pieConfig} />} />
                                    </Col>
                                </Row> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 50 }} />
                        }
                    </Paragraph>
                    <Paragraph style={{ padding: '0 24px', }}>
                        <ReachDayFooter bill={this.state.bill} />
                    </Paragraph>
                    <ModalForm submitTimeout={3000} initialValues={this.state.initialValues} visible={this.state.visibleModalForm} modalProps={{
                        onCancel: this.onCloseModalForm
                    }} width={600} layout={'horizontal'} onFinish={this.onClearingFinish}
                        title={
                            <div>
                                <Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 18 }}>结算</Text>
                                <Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>清单信息</Text>
                            </div>
                        } >
                        <ReachDayTitle bill={this.state.bill} />
                        <Divider><Text italic style={{ fontSize: 12, marginLeft: 15 }}>价格</Text></Divider>
                        <Paragraph>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <ul style={{ marginLeft: 0 }}>
                                        <li><Text>厂商试用期：{this.state.bill.game.trial_price}<Text style={{ margin: '0 5px' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text><Text style={{ color: '#1890ff', marginLeft: 50 }}>{this.state.bill.game.trial_price * this.state.bill.trial_day}</Text></li>
                                        <li><Text>厂商正式工：{this.state.bill.game.formal_price}<Text style={{ margin: '0 5px' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text><Text style={{ color: '#1890ff', marginLeft: 50 }}>{this.state.bill.game.formal_price * this.state.bill.formal_day}</Text></li>
                                        <li><Text>自定试用期：{this.state.bill.game.custom_trial_price}<Text style={{ margin: '0 5px' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text><Text style={{ color: '#1890ff', marginLeft: 50 }}>{this.state.bill.game.custom_trial_price * this.state.bill.trial_day}</Text></li>
                                        <li><Text>自定正式工：{this.state.bill.game.custom_formal_price}<Text style={{ margin: '0 5px' }}>/</Text>{this.state.bill.game.reach_status === 1 ? '小时' : '天'}</Text><Text style={{ color: '#1890ff', marginLeft: 50 }}>{this.state.bill.game.custom_formal_price * this.state.bill.formal_day}</Text></li>
                                    </ul>
                                </Col>
                                <Col span={12}>
                                    <ul style={{ marginLeft: 0 }}>
                                        <li><Text>厂商总价：</Text><Text style={{ color: '#1890ff', marginLeft: 50 }}>{this.state.bill.cost}</Text></li>
                                        <li><Text>自定总价：</Text><Text type="danger" style={{ marginLeft: 50 }}>{this.state.bill.selling_price}</Text></li>
                                        <li><Text>所获利润：</Text><Text type="success" style={{ marginLeft: 50 }}>{this.state.bill.profit}</Text></li>
                                    </ul>
                                </Col>
                            </Row>
                        </Paragraph>
                        <Divider><Text italic style={{ fontSize: 12, marginLeft: 15 }}>奖金</Text></Divider>
                        <Paragraph style={{ marginBottom: 0 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name={'prize'} >
                                        <InputNumber addonBefore="奖金" addonAfter="¥" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Text italic type='secondary' style={{ fontSize: 12 }}>奖金可以是负数，复数奖金会自动扣除自定总价的价格(主播工资)，而正数奖金则会在利润里扣</Text>
                                </Col>
                            </Row>
                        </Paragraph>
                    </ModalForm>
                </Typography> : null

        )
    }
}


class ReachDayTitle extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            bill: props.bill
        }
    }

    render = () => {
        return (
            this.state.bill.game.reach_status == 0 ?
                <Paragraph>
                    <Text >游戏天数要求</Text>
                    <Text strong style={{ color: '#1890ff', margin: '0 5px' }}>{this.state.bill.game.reach_day}</Text>
                    <Text>天，每天直播时间需达到</Text>
                    <Text strong style={{ color: '#1890ff', margin: '0 5px' }}>{this.state.bill.game.play_time}</Text>
                    <Text>小时，该用户已播</Text>
                    <Text strong style={{ color: '#1890ff', margin: '0 5px' }}>{this.state.bill.info.count}</Text>
                    <Text>天，已达标</Text>
                    <Text type={this.state.bill.reach_day >= this.state.bill.game.reach_day ? 'success' : 'danger'} style={{ margin: '0 5px' }} strong>{this.state.bill.reach_day}</Text>
                    <Text>天，目前</Text>
                    <Text type={this.state.bill.reach_day >= this.state.bill.game.reach_day ? 'success' : 'danger'} style={{ margin: '0 5px' }} strong>{this.state.bill.reach_day >= this.state.bill.game.reach_day ? '已经达标' : '尚未达标'}</Text>
                </Paragraph> :
                <Paragraph>
                    <Text >游戏天数要求</Text>
                    <Text strong style={{ color: '#1890ff', margin: '0 5px' }}>{this.state.bill.game.reach_day}</Text>
                    <Text>天，直播时间总共需达到</Text>
                    <Text strong style={{ color: '#1890ff', margin: '0 5px' }}>{this.state.bill.game.play_time}</Text>
                    <Text>小时，该用户已播</Text>
                    <Text strong style={{ color: '#1890ff', margin: '0 5px' }}>{this.state.bill.play_time_total}</Text>
                    <Text>小时，目前</Text>
                    <Text type={this.state.bill.play_time_total >= this.state.bill.game.play_time ? 'success' : 'danger'} style={{ margin: '0 5px' }} strong>{this.state.bill.play_time_total >= this.state.bill.game.play_time ? '已经达标' : '尚未达标'}</Text>
                </Paragraph>
        )
    }
}

class ReachDayFooter extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            bill: props.bill
        }
    }

    render = () => {
        return (
            this.state.bill.game.reach_status == 0 ?
                <div>
                    {
                        this.state.bill.notReachDays.length > 0 ?
                            <Paragraph>
                                <Collapse>
                                    <Collapse.Panel header={
                                        <div>
                                            <Text>以下是不符合规则用户播放时间，</Text>
                                            <Text>用户已播放</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#1890ff' }}>{this.state.bill.info.count}</Text>
                                            <Text>天，</Text>
                                            <Text>该款游戏需每天播放</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#1890ff' }}>{this.state.bill.game.play_time}小时</Text>
                                            <Text>，其中</Text>
                                            <Text strong type={'danger'} style={{ margin: '0 5px' }}>{this.state.bill.notReachDays.length}天</Text>
                                            <Text>不符合规则</Text>

                                        </div>
                                    }>
                                        <Table style={{ padding: '5px 0' }} bordered size='small' columns={columnsNotReachDays} dataSource={this.state.bill.notReachDays} />
                                    </Collapse.Panel>
                                </Collapse>
                            </Paragraph> : null
                    }
                    {
                        this.state.bill.reachDays.length > 0 ?
                            <Paragraph>
                                <Collapse>
                                    <Collapse.Panel header={
                                        <div>
                                            <Text>以下是符合规则的时间，</Text>
                                            <Text>总达标</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#1890ff' }}>{this.state.bill.reach_day}</Text>
                                            <Text>天，其中试用期</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#ff4d4f' }}>{this.state.bill.trial_day}</Text>
                                            <Text>天，</Text>
                                            <Text>正式期</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#52c41a' }}>{this.state.bill.formal_day}</Text>
                                            <Text>天</Text>
                                        </div>
                                    }>
                                        <Table style={{ padding: '5px 0' }} bordered size='small' columns={columnsReachDays} dataSource={this.state.bill.reachDays} />
                                    </Collapse.Panel>
                                </Collapse>
                            </Paragraph> : null
                    }
                </div> :
                <div>
                    {
                        this.state.bill.allReachDays.length > 0 ?
                            <Paragraph>
                                <Collapse>
                                    <Collapse.Panel header={
                                        <div>
                                            <Text>目前已播</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#1890ff' }}>{this.state.bill.info.count}</Text>
                                            <Text>天，</Text>
                                            <Text>当前播放时长</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#1890ff' }}>{this.state.bill.play_time_total}</Text>
                                            <Text>小时，共需达到</Text>
                                            <Text strong style={{ color: '#1890ff', margin: '0 5px' }}>{this.state.bill.game.play_time}</Text>
                                            <Text>小时，目前</Text>
                                            <Text type={this.state.bill.play_time_total >= this.state.bill.game.play_time ? 'success' : 'danger'} style={{ margin: '0 5px' }} strong>{this.state.bill.play_time_total >= this.state.bill.game.play_time ? '已经达标' : '尚未达标'}</Text>
                                            <Text>其中试用期</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#ff4d4f' }}>{this.state.bill.trial_day}</Text>
                                            <Text>天，</Text>
                                            <Text>正式期</Text>
                                            <Text strong style={{ margin: '0 5px', color: '#52c41a' }}>{this.state.bill.formal_day}</Text>
                                            <Text>天</Text>
                                        </div>
                                    }>
                                        <Table style={{ padding: '5px 0' }} bordered size='small' columns={columnsAllReachDays} dataSource={this.state.bill.allReachDays} />
                                    </Collapse.Panel>
                                </Collapse>
                            </Paragraph> : null
                    }
                </div>
        )
    }
}





const getPieData = (data) => {
    return [
        {
            type: '公司',
            value: data.profit
        },
        {
            type: '主播',
            value: data.selling_price
        }
    ]
}



function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
}

const pieConfig = function (data) {
    return {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.64,
        meta: {
            value: {
                formatter: (v) => `${v} ¥`,
            },
        },
        label: {
            type: 'inner',
            offset: '-50%',
            style: {
                textAlign: 'center',
            },
            autoRotate: false,
            content: '{value}',
        },
        statistic: {
            title: {
                offsetY: -4,
                customHtml: (container, view, datum, data) => {
                    let total = 0
                    data.map((item) => {
                        total += item.value
                    })
                    let label = null
                    if (datum) {
                        label = Math.floor(Math.round(datum.value / total * 10000) / 100) || 0
                    }
                    const { width, height } = container.getBoundingClientRect();
                    const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                    const text = datum ? `${datum.type}:${label}%` : '总计';
                    return renderStatistic(d, text, {
                        fontSize: 28,
                    });
                },
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: '32px',
                },
                customHtml: (container, view, datum, data) => {
                    const { width } = container.getBoundingClientRect();
                    const text = datum ? `¥ ${datum.value}` : `¥ ${data.reduce((r, d) => r + d.value, 0)}`;
                    return renderStatistic(width, text, {
                        fontSize: 32,
                    });
                },
            },
        },
        // 添加 中心统计文本 交互
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
            {
                type: 'pie-statistic-active',
            },
        ],
    }
};

function numConvert(num) {
    if (num >= 10000) {
        num = Math.round(num / 1000) / 10 + 'W';
    } else if (num >= 1000) {
        num = Math.round(num / 100) / 10 + 'K';
    }
    return num || 0;
}