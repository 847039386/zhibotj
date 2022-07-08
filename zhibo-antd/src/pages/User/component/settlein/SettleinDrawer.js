import React from 'react';
import moment from 'moment';
import { Area } from '@ant-design/charts';
import { Drawer, Divider, Typography, Badge, Table, Space, Tooltip, Empty, Button } from 'antd';
import { PlusSquareOutlined, SwapOutlined, DeleteFilled, HighlightFilled, DollarCircleFilled } from '@ant-design/icons';
import { SettleinServices } from '../../../../services';
import { SettleinCreateModal, SettleinUpdateModal } from './index'
import { addMsg, errMsg, rmMsg, rmModal, utMsg } from '../../../../utils/modal';
import BillDrawer from './BillDrawer';

const { Paragraph, Text } = Typography;


class SettleinDrawer extends React.PureComponent {

    settleinTableColumns = [
        { title: '上次结算时间', width: 110, align: 'center', render: data => <div><Text strong style={{ color: data.clearing_start_time ? '#52c41a' : '#d3d3d3' }}>{data.clearing_start_time ? moment(data.clearing_start_time).format('YYYY/MM/DD') : '无'}</Text></div> },
        { title: '平台/游戏/公司', align: 'center', render: data => <div><Badge status={data.status ? 'processing' : 'default'}></Badge><Text>{data.platform_id.name}/{data.game_id.name}/{data.company_id.name}</Text><br /></div> },
        {
            title: '操作', align: 'center', width: 300,
            render: (record) => (
                <IsVisibleSettleinData data={record}>
                    <Space size="middle">
                        <Button type="primary" size="small" onClick={() => { this.onOpenBillDrawer(record) }}><DollarCircleFilled />账单</Button>
                        <Button type="primary" size="small" onClick={() => { this.onUpdateSettleINFO(record) }}><HighlightFilled />修改</Button>
                        <Button type="danger" size="small" onClick={() => { this.rmSettleinData(record) }} ><DeleteFilled />删除</Button>
                    </Space>
                </IsVisibleSettleinData>

            )
        }
    ];
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            SettleinData: [],
            myMode: true,
            isSettleinCreateModalOpen: true,
            isSettleinUpdateModalOpen: false,
            isSTab: true,
            workInfoDrawerVisible: false,
            Chart: { daus: [] },
            current_settlein: {},
            work_info: {},
            billDrawerVisible: false

        }
    }

    componentDidMount() {
        this.quidSettleinServices(this.props.data._id)
    }

    onSwitchMyMode = () => {
        var myMode = !this.state.myMode;
        this.setState({ myMode })
    }

    quidSettleinServices = (uid, dataSource, status) => {
        const _this = this;
        if (uid) {
            SettleinServices.quid({ uid }, (res) => {
                if (res && res.data.length > 0) {
                    res.data.map((item, index) => {
                        item.key = index;
                        item.create_at_toString = new Date(item.create_at).toLocaleDateString();
                        return item;
                    })
                    _this.setState({ SettleinData: res.data })
                    if (dataSource) {
                        status ? utMsg('入驻表', `${dataSource.user_name}`) : addMsg('入驻表', `${dataSource.user_name}`);
                    }
                }
            })
        } else {
            errMsg('并没有找到UID参数')
        }
    }

    onCreateSettleinSuccess = (result) => {
        this.quidSettleinServices(this.props.data._id, result, 0)
        this.setState({ isSettleinCreateModalOpen: false }, function () {
            this.setState({ isSettleinCreateModalOpen: true })
        })
    }

    onUpdateSettleinSuccess = (result) => {
        this.quidSettleinServices(this.props.data._id, result, 1)
        this.onUpdateSettleModalClose();
    }


    onUpdateSettleINFO = (currenUpdateData) => {
        const _this = this
        if (currenUpdateData._id) {
            SettleinServices.qid({ id: currenUpdateData._id }, (res) => {
                if (res && res.success) {
                    this.setState({
                        currenUpdateData: Object.assign(_this.props.data, { settlein: res.data }),
                        isSettleinUpdateModalOpen: true
                    })
                }
            })
        }
    }

    rmSettleinData = (record) => {
        const _this = this
        rmModal(function () {
            SettleinServices.h({ id: record._id })
            _this.quidSettleinServices(record.user_id)
            rmMsg('入驻表', _this.props.data.name)
        })



    }

    onUpdateSettleModalClose = () => {
        this.setState({ isSettleinUpdateModalOpen: false })
    }


    // Bill 页面开启
    onOpenBillDrawer = (record) => {
        this.setState({ billDrawerVisible: true, current_settlein: record })
    }
    onCloseBillDrawer = (record) => {
        this.setState({ billDrawerVisible: false })
    }




    render() {
        return (
            <div onClose={this.props.onClose} visible={this.state.visible}  >
                <Drawer push={{ distance: 800 }} width={650} visible={this.state.billDrawerVisible} onClose={this.onCloseBillDrawer} closable={false} >
                    {
                        this.state.billDrawerVisible && this.state.current_settlein && this.state.current_settlein._id ?
                            < BillDrawer settlein={this.state.current_settlein} /> : <div>无信息</div>
                    }
                </Drawer>
                <UpdateSettleinModalBUG onClose={this.onUpdateSettleModalClose} userName={this.props.data.name} status={this.state.isSettleinUpdateModalOpen} data={this.state.currenUpdateData} onSuccess={this.onUpdateSettleinSuccess} />
                <Typography>
                    <Paragraph style={{ marginBottom: 20 }}>
                        <Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 24 }}>基本信息</Text>
                        <Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>编号:<Text copyable type='secondary' style={{ marginLeft: 10 }}>{this.props.data._id}</Text></Text>
                    </Paragraph>
                    <Divider></Divider>
                    <Paragraph>
                        <Text strong>姓名</Text> :<Text style={{ marginLeft: 10 }}>{this.props.data.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>微信</Text> :<Text style={{ marginLeft: 10 }}>{this.props.data.wx}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>状态</Text> :<Badge style={{ marginLeft: 10 }} status={this.props.data.status ? 'processing' : 'default'} text={this.props.data.status ? '在职' : '离岗'} />
                    </Paragraph>
                    {
                        this.props.data.status === 1 ?
                            <Paragraph style={{ cursor: 'pointer' }}>
                                <CreateSettleinModalBUG userName={this.props.data.name} status={this.state.isSettleinCreateModalOpen} data={this.props.data} onSuccess={this.onCreateSettleinSuccess}>
                                    <Text strong>入驻</Text> :<Text strong style={{ margin: '0 5px 0 10px', color: '#1890ff' }}>{this.state.SettleinData.length}</Text><Text>家</Text>
                                    <Badge count={<PlusSquareOutlined style={{ color: '#f5222d', marginLeft: 5, marginBottom: 3 }} />} />
                                </CreateSettleinModalBUG>
                            </Paragraph> :
                            <Paragraph>
                                <Text strong>入驻</Text> :<Text strong style={{ margin: '0 5px 0 10px', color: '#1890ff' }}>{this.state.SettleinData.length}</Text><Text>家</Text>
                            </Paragraph>
                    }
                    <Divider style={{ margin: 0, cursor: 'pointer' }}>
                        <Tooltip title="点我切换风格">
                            <Paragraph onClick={this.onSwitchMyMode} style={{ margin: 0, cursor: 'pointer' }}>
                                <Text>{this.state.myMode ? '表格信息' : '简洁列表'}</Text>
                                <SwapOutlined style={{ marginLeft: 10, color: '#1890ff' }} />
                            </Paragraph>
                        </Tooltip>
                    </Divider>
                    <Paragraph>
                        <Badge status={'processing'} text={'在播'}></Badge>
                        <Badge status={'default'} style={{ marginLeft: 10 }} text={'停播'}></Badge>
                    </Paragraph>
                    <Paragraph>
                        <MyModeTab userName={this.props.data.name} isSwitch={this.state.myMode} columns={this.settleinTableColumns} dataSource={this.state.SettleinData} />
                    </Paragraph>
                </Typography>
            </div>
        )
    }
}

class SettleinLabel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }
    render() {
        var settleinSource = this.props.datas;
        if (settleinSource.length > 0) {
            return (
                <Paragraph>
                    <blockquote>
                        <ul>
                            {
                                settleinSource.map((data) => {
                                    return (
                                        <li key={data.key} style={{ marginBottom: 30 }}>
                                            <Typography>
                                                <Text>主播</Text>
                                                <Text strong style={{ margin: '0 10px', color: '#eb2f96' }}>{this.props.userName}</Text>
                                                <Text>于</Text>
                                                <Text strong style={{ margin: '0 10px', color: '#1890ff' }}>{data.create_at_toString}</Text>
                                                <Text>入职</Text>
                                                <Text strong style={{ margin: '0 10px', color: '#1890ff' }}>{data.company_id.name}</Text>
                                                <Text>公司，入驻在</Text>
                                                <Text strong style={{ margin: '0 10px', color: '#fa541c' }}>{data.platform_id.name}</Text>
                                                <Text>平台直播</Text>
                                                <Text strong style={{ margin: '0 10px', color: '#fa541c' }}>{data.game_id.name}</Text>
                                                <Text>游戏</Text>

                                            </Typography>
                                            <Typography>
                                                <Text>平台ID是</Text>
                                                <Text delete={data.platform_key ? false : true} strong={data.platform_key ? true : false} style={{ margin: '0 10px', color: data.platform_key ? '#1890ff' : '#5F5F5F' }}>{data.platform_key || '未填写'}</Text>
                                                <Text>平台昵称叫</Text>
                                                <Text delete={data.platform_name ? false : true} strong={data.platform_name ? true : false} style={{ margin: '0 10px', color: data.platform_name ? '#1890ff' : '#5F5F5F' }}>{data.platform_name || '未填写'}</Text>
                                                <Text>，游戏ID是</Text>
                                                <Text delete={data.game_key ? false : true} strong={data.game_key ? true : false} style={{ margin: '0 10px', color: data.game_key ? '#1890ff' : '#5F5F5F' }}>{data.game_key || '未填写'}</Text>
                                                <Text>游戏昵称叫</Text>
                                                <Text delete={data.game_name ? false : true} strong={data.game_name ? true : false} style={{ margin: '0 10px', color: data.game_name ? '#1890ff' : '#5F5F5F' }}>{data.game_name || '未填写'}</Text>
                                                <Text strong style={{ margin: '0 10px', color: data.status ? '#1890ff' : '#BFBFBF' }}>{data.status ? '目前在播' : '现已停播'}</Text>
                                            </Typography>
                                            <Divider></Divider>
                                        </li>)
                                })
                            }
                        </ul>
                    </blockquote>
                </Paragraph>
            )
        } else {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        }

    }
}

class SettleinTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }
    render() {
        return (
            <Paragraph>
                <Table style={{ fontSize: 12 }} bordered columns={this.props.columns} dataSource={this.props.dataSource} size="small"
                    expandable={{
                        expandedRowRender: (record) => {
                            return (
                                <div style={{ padding: 10 }}>
                                    <Paragraph>
                                        <Text>主播</Text>
                                        <Text strong style={{ margin: '0 10px', color: '#eb2f96' }}>{this.props.userName}</Text>
                                        <Text>所属</Text>
                                        <Text strong style={{ margin: '0 10px', color: '#1890ff' }}>{record.company_id.name}</Text>
                                        <Text>公司，于</Text>
                                        <Text strong style={{ margin: '0 10px', color: '#1890ff' }}>{record.create_at_toString}</Text>
                                        <Text>入驻</Text>
                                        <Text strong style={{ margin: '0 10px', color: '#fa541c' }}>{record.platform_id.name}</Text>
                                        <Text>平台直播</Text>
                                        <Text strong style={{ margin: '0 10px', color: '#fa541c' }}>{record.game_id.name}</Text>
                                        <Text>游戏，</Text>
                                        <Text strong style={{ color: record.status ? '#1890ff' : '#BFBFBF' }}>{record.status ? '目前在播' : '现已停播'}</Text>

                                    </Paragraph>
                                    <Paragraph>
                                        <Text>平台ID是:</Text>
                                        <Text code delete={record.platform_key ? false : true} strong={record.platform_key ? true : false} style={{ margin: '0 10px', color: record.platform_key ? '#1890ff' : '#5F5F5F' }}>{record.platform_key || '未填写'}</Text>
                                        <Text>平台昵称叫:</Text>
                                        <Text code delete={record.platform_name ? false : true} strong={record.platform_name ? true : false} style={{ margin: '0 10px', color: record.platform_name ? '#1890ff' : '#5F5F5F' }}>{record.platform_name || '未填写'}</Text>
                                    </Paragraph>
                                    <Paragraph>
                                        <Text>游戏ID是:</Text>
                                        <Text code delete={record.game_key ? false : true} strong={record.game_key ? true : false} style={{ margin: '0 10px', color: record.game_key ? '#1890ff' : '#5F5F5F' }}>{record.game_key || '未填写'}</Text>
                                        <Text>游戏昵称叫:</Text>
                                        <Text code delete={record.game_name ? false : true} strong={record.game_name ? true : false} style={{ margin: '0 10px', color: record.game_name ? '#1890ff' : '#5F5F5F' }}>{record.game_name || '未填写'}</Text>
                                    </Paragraph>
                                    <Paragraph>

                                    </Paragraph>
                                </div>
                            )
                        },
                    }}
                />
            </Paragraph>
        )
    }
}


class MyModeTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }
    render() {
        if (this.props.isSwitch) {
            return <SettleinTable userName={this.props.userName} columns={this.props.columns} dataSource={this.props.dataSource} />
        }
        return <SettleinLabel userName={this.props.userName} datas={this.props.dataSource} />
    }
}


class CreateSettleinModalBUG extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }
    render() {
        return this.props.status ? (
            <SettleinCreateModal data={this.props.data} onSuccess={this.props.onSuccess} >{this.props.children}</SettleinCreateModal>
        ) : null
    }
}

class UpdateSettleinModalBUG extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }
    render() {
        return this.props.status ? (
            <SettleinUpdateModal onClose={this.props.onClose} visible={this.props.status} userName={this.props.userName} data={this.props.data} onSuccess={this.props.onSuccess} >{this.props.children}</SettleinUpdateModal>
        ) : null
    }
}



class IsVisibleSettleinData extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const status = this.props.data.status
        const user_status = this.props.data.user_status
        const company_status = this.props.data.company_status
        const game_status = this.props.data.game_status
        const platform_status = this.props.data.platform_status
        var nov = [];
        var isv = true;

        if (company_status === 0) {
            nov.push('公司终止合作')
            isv = false
        } else if (company_status === 2) {
            nov.push('公司被删除')
            isv = false
        }

        if (game_status === 2) {
            nov.push('游戏被删除')
            isv = false
        } if (game_status === 0) {
            nov.push('游戏被下架')
        }

        if (platform_status === 2) {
            nov.push('平台被删除')
            isv = false
        } if (platform_status === 0) {
            nov.push('平台被撤离')
        }

        if (user_status === 2) {
            nov.push('用户被删除')
            isv = false
        } if (user_status === 0) {
            nov.push('用户已停职')
            isv = false
        }

        if (status === 2) {
            nov.push('该条入驻信息已被删除')
            isv = false
        }


        return (
            isv ? this.props.children :
                <Tooltip title={
                    <Typography style={{ padding: 10, cursor: 'pointer' }}>
                        <Paragraph style={{ color: '#FFFFFF' }}>有 {nov.length} 条原因：</Paragraph>
                        <Paragraph>
                            <ul style={{ marginLeft: 20 }}>
                                {
                                    nov.map((item, index) => {
                                        return (
                                            <li style={{ color: '#FFFFFF' }} key={`ISV${index}`}><Text style={{ color: '#FFFFFF' }}>{item}</Text></li>
                                        )
                                    })
                                }
                            </ul>
                        </Paragraph>
                    </Typography>
                }>
                    <Text style={{ color: '#d3d3d3', cursor: 'pointer' }}>禁止操作</Text>
                </Tooltip>
        )


    }

}


export default SettleinDrawer;
