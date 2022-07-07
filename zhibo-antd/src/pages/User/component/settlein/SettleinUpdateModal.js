import React from 'react';
import { Col, DatePicker, Form, Input, Row, Select, Divider, Typography, Switch, Radio } from 'antd';
import { CompanyServices, PlatformServices, GameServices, SettleinServices } from '../../../../services';
import Tools from '../../../../utils/tools';
import { ModalForm } from '@ant-design/pro-components';
import moment from 'moment';
const { Text } = Typography;
const { Option, OptGroup } = Select;

const dateFormat = 'YYYY/MM/DD';

const waitTime = (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};


class SettleinUpdateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            initialValues: Object.assign(this.props.data.settlein, { create_at: moment(this.props.data.settlein.create_at, dateFormat) }),
            companyData: [],
            gameData: [],
            platformData: [],
            isValue: false,
        }
    }

    componentDidMount() {
        const _this = this;
        GameServices.qst((res) => {
            if (res && res.data.length > 0) {
                _this.setState({ gameData: Tools.getDatasBySzm(res.data) })
            }
        })
        CompanyServices.qst((res) => {
            if (res && res.data.length > 0) {
                _this.setState({ companyData: Tools.getDatasBySzm(res.data) })
            }
        })
        PlatformServices.qst((res) => {
            if (res && res.data.length > 0) {
                _this.setState({ platformData: Tools.getDatasBySzm(res.data) });
            }
        })
    }

    updateSettleinPro = (settlein) => {
        return new Promise((resolve, reject) => {
            SettleinServices.ut(settlein, function (result) {
                if (result) {
                    resolve(settlein)
                } else {
                    reject('出现未知错误')
                }
            });
        });
    }

    onFinish = async (data) => {
        const user_name = this.props.data.name
        const settlein = {
            _id: data._id,
            platform_id: data.platform_id,
            platform_key: data.platform_key,
            platform_name: data.platform_name,
            company_id: data.company_id,
            game_id: data.game_id,
            game_key: data.game_key,
            game_name: data.game_name,
            description: data.description,
            // create_at: data.create_at,
            status: data.status ? 1 : 0,
            contract_status: data.contract_status
        }

        await this.updateSettleinPro(settlein);
        await waitTime(1000);
        if (this.props.onSuccess) {
            this.props.onSuccess(Object.assign(settlein, { user_name }))
        }
    }


    render() {
        return (
            <ModalForm
                title={
                    <div>
                        <Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 18 }}>{this.props.data.name}</Text>
                        <Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>入驻修改</Text>
                    </div>
                }
                layout='horizontal'
                initialValues={this.state.initialValues}
                style={{ padding: 10 }}
                visible={this.props.visible}
                modalProps={{
                    onCancel: () => {
                        this.props.onClose()
                    }
                }}
                submitTimeout={2000}
                onFinish={this.onFinish}
            >
                <Row gutter={24} >
                    <Col span={12}>
                        <Form.Item hidden name="_id" label="入驻编号" rules={[{ required: true, message: '请输入编号', }]} >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item tooltip={'用户的公司或公会'} name={'company_id'} label="公司名称" rules={[{ required: true, message: '请选择公司' }]}>
                            <Select placeholder="请选择公司" style={{ width: '100%' }} >
                                {
                                    this.state.companyData.map(item => {
                                        return (
                                            <OptGroup key={`szm${item.szm}`} label={item.szm}>
                                                {
                                                    item.datas.map(data => {
                                                        return (
                                                            <Option key={data._id} value={data._id}>{data.name}</Option>
                                                        )
                                                    })
                                                }
                                            </OptGroup>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item tooltip={'什么时候开播这款游戏的？'} name="create_at" label="入驻时间" rules={[{ required: true, message: '请选择用户入驻时间', }]} >
                            <DatePicker disabled style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item tooltip={'用户在哪个平台直播？'} name={'platform_id'} label="直播平台" rules={[{ required: true, message: '请选择直播平台', }]}>
                            <Select placeholder="请选择平台">
                                {
                                    this.state.platformData.map(item => {
                                        return (
                                            <OptGroup key={`szm${item.szm}`} label={item.szm}>
                                                {
                                                    item.datas.map(data => {
                                                        return (
                                                            <Option key={data._id} value={data._id}>{data.name}</Option>
                                                        )
                                                    })
                                                }
                                            </OptGroup>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item tooltip={'用户在播哪一款游戏？'} name={'game_id'} label="游戏名称" rules={[{ required: true, message: '请选择游戏', }]}>
                            <Select placeholder="请选择游戏">
                                {
                                    this.state.gameData.map(item => {
                                        return (
                                            <OptGroup key={`szm${item.szm}`} label={item.szm}>
                                                {
                                                    item.datas.map(data => {
                                                        return (
                                                            <Option key={data._id} value={data._id}>{data.name}</Option>
                                                        )
                                                    })
                                                }
                                            </OptGroup>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item tooltip={'合约状态'} name={'contract_status'} label="合约状态" rules={[{ required: true, message: '请选择合约状态', }]}>
                            <Radio.Group >
                                <Radio value={0}>试用期</Radio>
                                <Radio value={1}>正式工</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item style={{ marginBottom: 0 }} name={'status'} label={'直播状态'} tooltip="主播对于该条入驻信息的工作状态" extra="停播后工作表将会过滤数据,获取正在播出的主播工作信息,停播状态的主播将不能提交或修改工作数据,这为了保证数据的统计效率,与停职不同,即使主播在播,停职也会过滤掉关于他工作表的数据,因为一个主播可以入驻多个平台播多款游戏,所以每条入驻信息都会有自己的状态." rules={[{ required: true, message: '选择直播状态', }]} valuePropName="checked" >
                            <Switch style={{ width: 80 }} checkedChildren="在播" unCheckedChildren="停播" ></Switch>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider>其他信息</Divider>
                <Row gutter={24}>
                    <Col span={1}></Col>
                    <Col span={10}>
                        <Form.Item style={{ marginBottom: 5 }} name={'platform_key'} rules={[{ message: '请输入平台编号', }]}>
                            <Input placeholder="请输入平台ID" addonBefore="平台编号" />
                        </Form.Item>
                        <Form.Item name={'platform_name'} rules={[{ message: '请输入平台昵称', }]}>
                            <Input placeholder="请输入平台昵称" addonBefore="平台昵称" />
                        </Form.Item>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={10}>
                        <Form.Item style={{ marginBottom: 5 }} name={'game_key'} rules={[{ message: '请输入游戏编号', }]}>
                            <Input placeholder="请输入游戏ID" addonBefore="游戏编号" />
                        </Form.Item>
                        <Form.Item name={'game_name'} rules={[{ message: '请输入游戏昵称', }]}>
                            <Input placeholder="请输入游戏昵称" addonBefore="游戏昵称" />
                        </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                </Row>
                <Divider style={{ marginTop: 0 }}></Divider>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item name={'description'} label="备注" >
                            <Input.TextArea rows={4} placeholder="备注(选填)" />
                        </Form.Item>
                    </Col>
                </Row>
            </ModalForm>
        )

    }
}

export default SettleinUpdateModal;

