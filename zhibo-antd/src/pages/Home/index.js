import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { StatisticCard } from '@ant-design/pro-components';
import { Pie, G2, Column, measureTextWidth, Area, Line } from '@ant-design/charts';
import { Row, Col, Alert, Empty } from 'antd'
import { HomeServices } from '../../services'

const G = G2.getEngine('canvas');

export default class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ctime: moment(),
            sex: [{ sex: '男', value: 0 }, { sex: '女', value: 0 }],
            daus: [],
            turnover: [],
            bill: [],
            games: [],
        }

    }

    waitTime = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    };

    componentDidMount = async () => {
        const _this = this
        await HomeServices.info((res) => {
            if (res && res.datas[0] && res.datas[0].length > 0) {
                let sex = []
                res.datas[0].map((item) => {
                    sex.push({ sex: item._id === 1 ? '男' : '女', value: item.count })
                })
                _this.setState({ sex })
            }
            if (res && res.datas[1] && res.datas[1].length > 0) {
                var daus = []
                res.datas[1].map((item, index) => {
                    daus.push({ lable: item.user[0].name, value: item.dau_sum, type: '场观' })
                    daus.push({ lable: item.user[0].name, value: item.follow_sum, type: '粉丝' })
                    daus.push({ lable: item.user[0].name, value: item.like_sum, type: '点赞' })
                    return item;
                })
                _this.setState({ daus })
            }
            if (res && res.datas[2] && res.datas[2].length > 0) {
                var moneys = []
                var profit = 0
                var selling_price = 0
                var prize = 0
                res.datas[2].map((item, index) => {
                    profit += item.profit
                    selling_price += item.selling_price
                    prize += item.prize
                    moneys.push({ lable: item._id.substring(item._id.length - 5), value: item.selling_price + item.prize, type: '售价' })
                    moneys.push({ lable: item._id.substring(item._id.length - 5), value: item.profit + (-item.prize), type: '利润' })
                    // moneys.push({ lable: item._id.substring(item._id.length - 5), value: item.cost, type: '成本' })
                    if (item.prize > 0) {
                        moneys.push({ lable: item._id.substring(item._id.length - 5), value: item.prize, type: '奖金' })
                    }

                })
                var bill = [{ type: '利润', value: profit }, { type: '主播', value: selling_price }]
                if (prize > 0) {
                    bill.push({ type: '红包', value: prize })
                }

                _this.setState({ turnover: moneys, bill: bill })
            }
            if (res && res.datas[3] && res.datas[3].length > 0) {
                var games = getGameOther(res.datas[3], 4)
                _this.setState({ games })
            }


        })
    }






    render = () => {
        return (
            <div>
                <Row gutter={24}>
                    <Col span={24}>
                        <Alert message={<Time />} type="info" />
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={8}>
                        <StatisticCard title="男女比例" chart={<Pie {...sexConfig(this.state.sex)} />} />
                    </Col>
                    <Col span={8}>
                        <StatisticCard title="7天内场观总量排名" chart={<Column {...rankingConfig(this.state.daus)} />} />
                    </Col>
                    <Col span={8}>
                        <StatisticCard title="近15次财务" chart={<Pie {...costConfig(this.state.bill)} />} />
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                        <StatisticCard title="近15次收出" chart={<Column {...turnoverConfig(this.state.turnover)} />} />
                    </Col>
                    <Col span={12}>
                        <StatisticCard title="游戏占比" chart={<Pie {...gamesConfig(this.state.games)} />} />
                    </Col>
                </Row>
            </div>
        )
    }
}

function Time() {
    const [value, setValue] = useState(moment());
    const [timers, setTimers] = useState([]);
    const saveCallBack = useRef();
    const callBack = () => {
        setValue(moment());
    };
    useEffect(() => {
        saveCallBack.current = callBack;
        return () => { };
    });
    useEffect(() => {
        const tick = () => {
            saveCallBack.current();
        };
        const timer = setInterval(tick, 50);
        timers.push(timer);
        setTimers(timers);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <span>{value.format('YYYY-MM-DD HH:mm:ss')}</span>
    )
}


const sexConfig = (data) => {
    return {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'sex',
        radius: 0.66,
        color: ['#1890ff', '#f04864'],
        label: {
            content: (obj) => {
                const group = new G.Group({});
                group.addShape({
                    type: 'image',
                    attrs: {
                        x: 0,
                        y: 0,
                        width: 40,
                        height: 50,
                        img:
                            obj.sex === '男'
                                ? 'https://gw.alipayobjects.com/zos/rmsportal/oeCxrAewtedMBYOETCln.png'
                                : 'https://gw.alipayobjects.com/zos/rmsportal/mweUsJpBWucJRixSfWVP.png',
                    },
                });
                group.addShape({
                    type: 'text',
                    attrs: {
                        x: 20,
                        y: 54,
                        text: `${(obj.percent * 100).toFixed(0)}%`,
                        textAlign: 'center',
                        textBaseline: 'top',
                        fill: obj.sex === '男' ? '#1890ff' : '#f04864',
                    },
                });
                return group;
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };
}

const rankingConfig = (data) => {
    return {
        data,
        xField: 'lable',
        yField: 'value',
        seriesField: 'type',
        isGroup: 'true',
    }
}


const turnoverConfig = (data) => {
    return {
        data,
        isStack: true,
        xField: 'lable',
        yField: 'value',
        seriesField: 'type',
        color: ['#101B37', '#02C8ED', '#E41476']
    }
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

const costConfig = function (data) {
    return {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.64,
        color: ['#02C8ED', '#101B37', '#E41476'],
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


const gamesConfig = (data) => {
    return {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        legend: false,
        label: {
            type: 'spider',
            labelHeight: 40,
            formatter: (data, mappingData) => {
                const group = new G.Group({});
                group.addShape({
                    type: 'circle',
                    attrs: {
                        x: 0,
                        y: 0,
                        width: 40,
                        height: 50,
                        r: 5,
                        fill: mappingData.color,
                    },
                });
                group.addShape({
                    type: 'text',
                    attrs: {
                        x: 10,
                        y: 8,
                        text: `${data.type}`,
                        fill: mappingData.color,
                    },
                });
                group.addShape({
                    type: 'text',
                    attrs: {
                        x: 0,
                        y: 25,
                        text: `${data.value}个 ${(data.percent * 100).toFixed(0)}%`,
                        fill: 'rgba(0, 0, 0, 0.65)',
                        fontWeight: 700,
                    },
                });
                return group;
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    }
}



const getGameOther = (arr, maxCount = 5) => {
    let game = []
    let other = 0
    game.push({ type: '其他', value: 0 })
    if (arr.length > maxCount) {
        arr.map((item, index) => {
            if (index < maxCount) {
                game.push({ type: item.game[0].name, value: item.count, })
            } else {
                other += item.count
                game[0].value = other
            }
        })
        game.push(game.shift());
    } else {
        arr.map((item, index) => {
            game.push({ type: item.game[0].name, value: item.count, })
        })
        game = game.splice(1)
    }

    return game
}

