import React from 'react';
import moment from 'moment';
import { Drawer, Divider, Typography, Table, Space, Tooltip, Button } from 'antd';
import { WorkServices } from '../../../../services';
import SettleinInfo from './SettleinInfo';

const { Paragraph, Text } = Typography;


class SettleinDrawer extends React.PureComponent {

    columns = [
        { title: '起始时间', align: 'center', width: 100, render: data => <div><Text>{moment(data.start_of_time).format('YYYY/MM/DD')}</Text></div> },
        { title: '结算时间', align: 'center', width: 100, render: data => <div><Text strong style={{ color: data.status ? '#1890ff' : '#d3d3d3' }}>{data.end_of_time ? moment(data.end_of_time).format('YYYY/MM/DD') : '未结算'}</Text></div> },
        { title: '状态', align: 'center', width: 100, key: 'status', render: data => <div><Text strong style={{ color: data.status ? '#52c41a' : '#d3d3d3' }}>{data.status ? '已结算' : '未结算'}</Text></div> },
        {
            title: '操作', key: 'action', align: 'center', width: '30%',
            render: (record) => (
                // <IsVisibleSettleinData data={record}>
                <Space size="middle">
                    <Button onClick={() => { this.onOpenWorkInfoDrawer(record) }} type="primary" size="small">查看</Button>
                </Space>
                // </IsVisibleSettleinData> 

            )
        }
    ];
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            pagination: { current: 1, size: 10, total: 0, },
            workInfoDrawerVisible: false,
            settlein: props.settlein,
            current_work: {}
        }
    }

    componentDidMount() {
        this.nextPage(1, this.state.pagination.size)
    }

    nextPage = (page = 1, size = 10) => {
        const _this = this
        const query = { page, size, settlein_id: this.state.settlein._id }
        WorkServices.q(query, function (res) {
            if (res.data && res.data.length > 0) {
                res.data.map((item) => {
                    item.key = item._id
                    return item
                })
                _this.setState({ datas: res.data, pagination: res.pagination })
            }
        })
    }


    // 进入SettlinDrawer 页面

    onOpenWorkInfoDrawer = (work) => {
        this.setState({ workInfoDrawerVisible: true, current_work: work })
    }

    onCloseWorkInfoDrawer = () => {
        this.setState({ workInfoDrawerVisible: false })
    }

    onClearingSuccess = () => {
        this.nextPage(1, this.state.pagination.size)
        if (this.props.onClearingSuccess) {
            this.props.onClearingSuccess()
        }
    }

    render() {
        return (
            <div>
                <Typography>
                    <Paragraph style={{ marginBottom: 20 }}>
                        <Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 24 }}>账单</Text>
                        <Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>编号:</Text>
                        <Text copyable type='secondary' style={{ marginLeft: 10 }}>{this.state.settlein._id}</Text>
                    </Paragraph>
                    <Divider></Divider>
                    <Paragraph>
                        <Text strong>主播</Text> :<Text style={{ marginLeft: 10 }}>{this.state.settlein.user_id.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>平台</Text> :<Text style={{ marginLeft: 10 }}>{this.state.settlein.platform_id.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>公司</Text> :<Text style={{ marginLeft: 10 }}>{this.state.settlein.company_id.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>游戏</Text> :<Text style={{ marginLeft: 10 }}>{this.state.settlein.game_id.name}</Text>
                    </Paragraph>
                    <Divider><Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16 }}>账单</Text><Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>当前账单与历史账单</Text></Divider>
                    <Paragraph>
                        <Table style={{ fontSize: 12 }} bordered columns={this.columns} dataSource={this.state.datas} size="small" pagination={{ current: this.state.pagination.current, total: this.state.pagination.total, onChange: this.nextPage, pageSize: this.state.pagination.size, showSizeChanger: false, responsive: false, hideOnSinglePage: true, position: ['bottomCenter'] }} />
                    </Paragraph>
                </Typography>

                <Drawer width={1000} visible={this.state.workInfoDrawerVisible} onClose={this.onCloseWorkInfoDrawer} closable={false} bodyStyle={{ backgroundColor: '#F0F2F5', padding: 0 }}>
                    {
                        this.state.workInfoDrawerVisible ? < SettleinInfo onClearingSuccess={this.onClearingSuccess} settlein={this.state.settlein} work={this.state.current_work} /> : null
                    }
                </Drawer>
            </div>
        )
    }
}


export default SettleinDrawer;
