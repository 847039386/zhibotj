import { Space, Table, Button, Col, Input, Row, Avatar, Badge, Divider, Typography, Select, Tag } from 'antd';
import { PlusOutlined, DeleteFilled, HighlightFilled } from '@ant-design/icons';
import { GameServices } from '../../services';
import React from 'react';
import { addMsg, rmModal, rmMsg, utMsg } from '../../utils/modal';
import Tools from '../../utils/tools';
import GeneralComponent from '../../component/GeneralComponent'
import { GameFormat, DefaultGameValues } from './data'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      // { title: '首字母', key: 'szm', dataIndex:'szm' ,width:80 ,align :'center'},
      {
        title: '游戏名称', key: 'name', render: data => {
          return (
            <div>
              <div style={{ verticalAlign: 'middle', display: 'inline-block' }}><Avatar shape="square" size={50} src={data.img_url || null}>{data.name}</Avatar></div>
              <div style={{ verticalAlign: 'middle', display: 'inline-block', marginLeft: 30 }}><Badge status={data.status === 1 ? 'processing' : 'default'}></Badge><Typography.Text style={{ color: data.status !== 2 ? '#00000' : '#d3d3d3' }}>{data.name}</Typography.Text></div>
            </div>
          )
        }
      },
      {
        title: '操作', key: 'action', width: 250,
        render: (text, record, index) => (
          record.status < 2 ?
            <Space size="middle">
              <Button type="primary" size={'small'} icon={<HighlightFilled />} onClick={() => this.onGameModalOpen(record)}>修改</Button>
              <Button type="primary" danger size={'small'} icon={<DeleteFilled />} onClick={() => this.rmData(record)}>删除</Button>
            </Space> : <Typography.Text style={{ color: '#d3d3d3' }}>已被删除</Typography.Text>
        ),
      },
    ];

    this.state = {
      datas: [],
      pagination: { current: 1, size: 0, total: 0, },
      // search
      status_game_options: [{ label: '上架', value: 1 }, { label: '下架', value: 0 }, { label: '已删除', value: 2 }],
      game_status: [1],
      search: { status: 1 },
      //  创建或修改所需要的值
      GameModal: { title: null, tip: null },
      current_GameID: null,
      initialGameValues: DefaultGameValues,
      GameModalVisible: false,
    }
  }

  componentDidMount = () => {
    this.nextPage(1);
  }

  nextPage = (page = 1, size = 10) => {
    const _this = this
    const query = { page, size, query: this.state.search }
    GameServices.q(query, function (res) {
      if (res) {
        _this.setState({ datas: res.data, pagination: res.pagination })
      }
    })
  }

  rmData = (record) => {
    rmModal(() => {
      const id = record._id;
      const _this = this;
      const currentPage = this.state.pagination.current;
      GameServices.h({ id }, (data) => {
        if (data) {
          rmMsg('游戏表', record.name);
          _this.nextPage(currentPage)
        }
      })
    })
  }


  // search
  onSearchGameNameChange = (e) => {
    const value = e.target.value
    let search = this.state.search;
    if (value) {
      search = Object.assign(search, { name: { $regex: value } })
    } else {
      delete search.name
    }
    this.setState({ search })
    this.nextPage()
  }

  gameStatusRef = React.createRef()

  onGameStatusChange = (values) => {
    let search = this.state.search;
    var $or = []
    if (values.length < 1) {
      values = [1];
      this.gameStatusRef.current.blur();
    }

    values.map(status => {
      $or.push({ status })
      return status
    })
    delete search.status
    this.setState({ search: Object.assign(search, { $or }), game_status: values })
    this.nextPage()
  }

  // Modal模块的FUN START
  GameRef = React.createRef();
  onGameModalOpen = async (record) => {
    await this.setState({ GameModalVisible: true })
    record._id ? await this.setState({ current_GameID: record._id, GameModal: { title: '修改游戏', tip: `编号：${record._id}` } }) : await this.setState({ current_GameID: null, GameModal: { title: '创建游戏', tip: '游戏名不许为空哦' } })
    record ? this.GameRef.current.setFieldsValue(record) : this.GameRef.current.setFieldsValue(DefaultGameValues)
  }

  onGameModalClose = () => {
    this.setState({ GameModalVisible: false })
  }

  onGameFormFinish = async (formValues) => {
    formValues = Object.assign(formValues, { szm: Tools.getFirstLetter(formValues.name) })
    this.state.current_GameID ? await GameServices.ut(Object.assign(formValues, { id: this.state.current_GameID })) : await GameServices.ct(formValues)
    await this.nextPage(this.state.pagination.current);
    await Tools.waitTime(1000)
    await this.onGameModalClose();
    this.state.current_GameID ? utMsg('游戏表', formValues.name) : addMsg('游戏表', formValues.name)
  }
  // Modal模块的FUN END


  render() {
    return (
      <div>
        <GeneralComponent styleModal={{ top: 20 }} title={this.state.GameModal.title} titleTip={this.state.GameModal.tip} ref={this.GameRef} format={GameFormat} onFinish={this.onGameFormFinish} onClose={this.onGameModalClose} initialValues={this.state.initialGameValues} visible={this.state.GameModalVisible} />
        <Space>
          <Button type="primary" icon={<PlusOutlined />} style={{ height: 30, justifyContent: 'center' }} onClick={this.onGameModalOpen}>添加游戏</Button>
          <Input onChange={this.onSearchGameNameChange} placeholder={'请输入游戏名称'} />
          <Select options={this.state.status_game_options} value={this.state.game_status} onChange={this.onGameStatusChange} ref={this.gameStatusRef} showSearch={false} onMouseDown={e => e.preventDefault()} mode="multiple" showArrow tagRender={tagRender} style={{ width: 225, }} />
        </Space>
        <Divider></Divider>
        <Table bordered columns={this.columns} dataSource={this.state.datas} rowKey="_id" style={{ tableLayout: 'fixed' }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '10px 0' }}>
                <Row gutter={24}>
                  <Col span={2} style={{ textAlign: 'right', }}>备注：</Col>
                  <Col span={22}>{record.description}</Col>
                </Row>
              </div>
            ),
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