import React from 'react';
import Tools from '../../utils/tools';
import moment from 'moment';
import { addWorkMsg } from '../../utils/modal';
import { Space, Table, Button, Typography } from 'antd';
import { CalendarFilled } from '@ant-design/icons';
import { SettleinServices, WorkServices } from '../../services';
import { GeneralComponent } from '../../component';
import { WorkFormat, initialWorkValues } from './data'
import Item from 'antd/lib/list/Item';


const { Text } = Typography;

const getPlayTime = (date) => {
  let newDate = moment(date)
  let hour = newDate.hour()
  let minute = newDate.minute()
  let second = newDate.second()
  console.log(hour, minute, second, 'date', (hour * 60 * 60) + (minute * 60) + second, '????')
  // const start = moment().startOf('day');
  // const end = moment(date);
  // const time = start - end;
  return (hour * 60 * 60) + (minute * 60) + second;
}

class App extends React.Component {

  constructor(props) {

    super(props);
    this.columns = [
      { title: '用户名', key: 'uName', render: data => <Text>{data.user_id ? data.user_id.name : ""}</Text> },
      { title: '平台  /  游戏  /  公司', key: 'PGC', render: data => <Text><Text strong style={{ color: '#fa541c' }}>{data.platform_id ? data.platform_id.name : ''}</Text><Text style={{ margin: '0 10px' }}>/</Text>{data.game_id ? data.game_id.name : ''}<Text style={{ margin: '0 10px' }}>/</Text>{data.company_id ? data.company_id.name : ''}</Text> },
      {
        title: '操作', key: 'action', width: 250,
        render: (record) => (
          <Space size="middle">
            <Button type="primary" size={'small'} icon={<CalendarFilled />} onClick={() => this.onOpenCreateWorkModal(record)}>统计</Button>
          </Space>
        ),
      },
    ];

    this.state = {
      datas: [],
      pagination: { current: 1, size: 0, total: 0, },
      isWorkCreateModalOpen: false,
      currentSettleinData: {},
      initialValues: initialWorkValues
    }

  }
  componentDidMount = () => {
    this.nextPage(1);
  }

  nextPage = (page) => {
    var _this = this
    SettleinServices.qw({ page: page, size: 10 }, function (res) {
      if (res) {
        _this.setState({ datas: res.data, pagination: res.pagination })
      }
    })
  }

  onOpenCreateWorkModal = (record) => {
    this.setState({ isWorkCreateModalOpen: true, currentSettleinData: record })
  }

  onCloseCreateWrok = () => {
    this.setState({ isWorkCreateModalOpen: false })
  }

  onFinish = async (data) => {
    var record = this.state.currentSettleinData;
    console.log(data)
    const newPrams = {
      work: Object.assign(data, { settlein_id: record._id, work_time: getPlayTime(data.work_time), contract_status: record.contract_status }),
      settlein: { _id: record._id, work_at: data.work_at, contract_status: record.contract_status }
    }
    await WorkServices.addTask(newPrams);
    var currentPage = this.state.pagination.current
    if (this.state.datas.length - 1 <= 0) {
      currentPage = this.state.pagination.current - 1 <= 0 ? 1 : this.state.pagination.current - 1
    }
    await this.nextPage(currentPage);
    await Tools.waitTime(500)
    this.onCloseCreateWrok()
    addWorkMsg(record.user_id.name)
  }


  render() {
    return (
      <div>
        <Table bordered columns={this.columns} dataSource={this.state.datas} rowKey="_id" style={{ tableLayout: 'fixed' }}
          pagination={{
            current: this.state.pagination.current,
            total: this.state.pagination.total,
            onChange: this.nextPage,
            pageSize: 10,
            showSizeChanger: false,
            responsive: false,
            hideOnSinglePage: true,
            position: ['bottomCenter'],
          }} />
        <GeneralComponent title={this.state.currentSettleinData.user_id ? this.state.currentSettleinData.user_id.name : ''} titleTip={`工单编号：${this.state.currentSettleinData ? this.state.currentSettleinData._id : ''}`} format={WorkFormat} onFinish={this.onFinish} onClose={this.onCloseCreateWrok} initialValues={this.state.initialValues} visible={this.state.isWorkCreateModalOpen} />
      </div>
    );
  }
}

export default App;