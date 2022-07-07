import React from 'react';
import Tools from '../../utils/tools';
import { UserServices } from '../../services';
import { Space, Table, Button, Col, Input, Row, Badge, Typography, Divider, Select, Tag, Drawer, AutoComplete } from 'antd';
import { PlusOutlined, HddFilled, DeleteFilled, HighlightFilled, } from '@ant-design/icons';
import { addMsg, rmModal, rmMsg, utMsg } from '../../utils/modal';
import { SettleinDrawer } from './component/settlein';
import GeneralComponent from '../../component/GeneralComponent'
import { UserFormat, DefaultUserValues } from './data'
const { Option } = Select;


class App extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      { title: '姓名', width: 150, key: 'name', render: data => <span><Badge status={data.status === 1 ? 'processing' : 'default'}></Badge><Typography.Text style={{ color: data.status !== 2 ? '#00000' : '#d3d3d3' }}>{data.name}</Typography.Text></span> },
      { title: '性别', width: 65, align: 'center', key: 'sex', render: data => <span><Typography.Text strong style={{ color: data.sex ? '#1890ff' : '#f04864' }}>{data.sex ? '男' : '女'}</Typography.Text></span> },
      { title: '微信', dataIndex: 'wx', key: 'wx', width: 150, render: data => <Typography.Text style={{ color: data ? '#00000' : '#d3d3d3' }}>{data ? data : '无微信'}</Typography.Text> },
      { title: '备注', dataIndex: 'description', key: 'description', render: data => <Typography.Text style={{ color: data ? '#00000' : '#d3d3d3' }}>{data ? data : '无备注'}</Typography.Text> },
      {
        title: '操作', key: 'action', align: 'center', width: 250,
        render: (text, record, index) => (
          record.status < 2 ?
            <Space size="middle">
              <Button type="primary" size={'small'} icon={<HddFilled />} onClick={() => this.toSettlein(record)}>入驻信息</Button>
              <Button type="primary" size={'small'} icon={<HighlightFilled />} onClick={() => this.onUserModalOpen(record)}>修改</Button>
              <Button type="primary" danger size={'small'} icon={<DeleteFilled />} onClick={() => this.rmData(record)}>删除</Button>
            </Space> : <Typography.Text style={{ color: '#d3d3d3' }}>已被删除</Typography.Text>
        ),
      },
    ];

    this.state = {
      datas: [],
      pagination: { current: 1, size: 0, total: 0, },
      //入住
      settleinVisible: false,
      currentSettleinData: {},
      //查询
      status_user_options: [{ label: '在岗', value: 1 }, { label: '离职', value: 0 }, { label: '已删除', value: 2 }],
      user_status: [1],
      search: { status: 1 },
      //  创建或修改所需要的值
      UserModal: { title: null, tip: null },
      current_UserID: null,
      initialUserValues: DefaultUserValues,
      UserModalVisible: false,
      //自动补全
      optionsName: []
    }
  }


  componentDidMount = () => {
    this.nextPage(1);
  }

  toSettlein = (currentSettleinData) => {
    this.setState({ settleinVisible: true, currentSettleinData })
  }

  onSettleinClose = () => {
    this.setState({ settleinVisible: false })
  }

  nextPage = (page = 1, size = 10, callback) => {
    const _this = this
    const query = { page, size, query: this.state.search }
    UserServices.q(query, function (res) {
      if (res) {
        _this.setState({ datas: res.data, pagination: res.pagination })
      }
      if (callback) {
        callback(res)
      }
    })
  }

  rmData = (record) => {
    rmModal(() => {
      const id = record._id;
      const _this = this;
      const currentPage = this.state.pagination.current;
      UserServices.h({ id }, (data) => {
        if (data) {
          rmMsg('用户表', record.name);
          _this.nextPage(currentPage)
        }
      })
    })
  }

  // search
  onSearchUserNameChange = (value) => {
    console.log(value)
    // console.log(e)
    let search = this.state.search;
    if (value) {
      search = Object.assign(search, { name: { $regex: value } })
      this.setState({ search }, function () {
        this.nextPage(1, 20, (res) => {
          if (res && res.data.length > 0) {
            let options = []
            res.data.map((item) => {
              options.push({ label: item.name, value: item.name })
            })
            this.setState({ optionsName: options })

          }
        })
      })
    } else {
      delete search.name
      this.setState({ optionsName: [], search })
      this.nextPage()

    }
  }
  onSelectUserName = (value) => {
    let search = this.state.search
    search = Object.assign(search, { name: { $regex: value } })
    this.setState({ search, optionsName: [] })
    this.nextPage()
  }


  onUserSexChange = (value) => {
    let search = this.state.search;
    if (value === 0 || value === 1) {
      search = Object.assign(search, { sex: value })
    } else {
      delete search.sex
    }
    this.setState({ search })
    this.nextPage()
  }

  userStatusRef = React.createRef()

  onUserStatusChange = (values) => {
    let search = this.state.search;
    var $or = []
    if (values.length < 1) {
      values = [1];
      this.userStatusRef.current.blur();
    }

    values.map(status => {
      $or.push({ status })
      return status
    })
    delete search.status
    this.setState({ search: Object.assign(search, { $or }), user_status: values })
    this.nextPage()
  }

  // Modal模块的FUN START
  UserRef = React.createRef();
  onUserModalOpen = async (record) => {
    await this.setState({ UserModalVisible: true })
    record._id ? await this.setState({ current_UserID: record._id, UserModal: { title: '修改用户', tip: `编号：${record._id}` } }) : await this.setState({ current_UserID: null, UserModal: { title: '创建用户', tip: '用户名不许为空哦' } })
    record ? this.UserRef.current.setFieldsValue(record) : this.UserRef.current.setFieldsValue(DefaultUserValues)
  }

  onUserModalClose = () => {
    this.setState({ UserModalVisible: false })
  }

  onUserFormFinish = async (formValues) => {
    this.state.current_UserID ? await UserServices.ut(Object.assign(formValues, { id: this.state.current_UserID })) : await UserServices.ct(formValues)
    await this.nextPage(this.state.pagination.current);
    await Tools.waitTime(1000)
    await this.onUserModalClose();
    this.state.current_UserID ? utMsg('用户表', formValues.name) : addMsg('用户表', formValues.name)
  }
  // Modal模块的FUN END


  render() {
    return (
      <div>
        <Drawer push={{ distance: 200 }} width={800} visible={this.state.settleinVisible} bodyStyle={{ paddingBottom: 80, }} closable={false} onClose={this.onSettleinClose} >
          {
            this.state.settleinVisible ? <SettleinDrawer data={this.state.currentSettleinData} /> : null
          }
        </Drawer>
        <GeneralComponent width={500} title={this.state.UserModal.title} titleTip={this.state.UserModal.tip} ref={this.UserRef} format={UserFormat} onFinish={this.onUserFormFinish} onClose={this.onUserModalClose} initialValues={this.state.initialUserValues} visible={this.state.UserModalVisible} />
        <Space>
          <Button type="primary" icon={<PlusOutlined />} style={{ height: 30, justifyContent: 'center' }} onClick={this.onUserModalOpen}>添加用户</Button>
          <Select onChange={this.onUserSexChange} defaultValue={2} style={{ width: 80 }}>
            <Option value={2}>全部</Option>
            <Option value={1}>男</Option>
            <Option value={0}>女</Option>
          </Select>
          <AutoComplete options={this.state.optionsName} onSearch={this.onSearchUserNameChange} onSelect={this.onSelectUserName} placeholder={'请输入用户姓名'} style={{ width: 200 }} />
          <Select ref={this.userStatusRef} showSearch={false} onMouseDown={e => e.preventDefault()} onChange={this.onUserStatusChange} mode="multiple" showArrow tagRender={tagRender} value={this.state.user_status} style={{ width: 225, }} options={this.state.status_user_options} />
        </Space>

        <Divider></Divider>

        <Table bordered columns={this.columns} dataSource={this.state.datas} rowKey="_id" style={{ tableLayout: 'fixed' }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '10px 0' }}>
                <Row gutter={24}>
                  <Col span={2} style={{ textAlign: 'right' }}>备注：</Col>
                  <Col span={22}>{record.description}</Col>
                </Row>
              </div>
            )
          }}
          pagination={{ current: this.state.pagination.current, total: this.state.pagination.total, onChange: this.nextPage, pageSize: 10, showSizeChanger: false, responsive: false, hideOnSinglePage: true, position: ['bottomCenter'] }} />
      </div>
    );
  }
}


const tagRender = (props) => {
  const { label, closable, onClose, value } = props;
  let color = ''
  if (value === 0) {
    color = '#AFAAA9'
  } else if (value === 1) {
    color = '#108ee9'
  } else {
    color = '#f50'
  }
  return (
    <Tag color={color} style={{ marginRight: 3, width: 60, textAlign: 'center' }}>{label}</Tag>
  );
};


export default App;