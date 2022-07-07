import React from 'react';
import moment from 'moment';
import XLSX from 'xlsx'
import { Space, Table, Button, Col, Input, Row, Avatar, Badge, Divider, Typography, Select, Tag, Tooltip, Drawer, DatePicker } from 'antd';
import { FileExcelFilled, AccountBookFilled } from '@ant-design/icons';
import { SettleinServices } from '../../services';
import BillDrawer from '../User/component/settlein/BillDrawer'
import Tools from '../../utils/tools';
const { RangePicker } = DatePicker;
moment.locale('zh-cn');

const { Text } = Typography

class App extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      { title: '主播', width: 100, align: 'center', key: 'name', render: data => <Text style={{ color: data.status !== 2 ? '#000000' : '#d3d3d3' }}>{data.user_id ? data.user_id.name : ''}</Text> },
      { title: '平台/游戏/公司', render: data => <div><Badge status={data.status == 1 ? 'processing' : 'default'}></Badge><Text style={{ color: data.status !== 2 ? '#000000' : '#d3d3d3' }}>{data.platform_id.name}/{data.game_id.name}/{data.company_id.name}</Text><br /></div> },
      { title: '结算日期', render: data => <Text>{toDateStr(data.next_clearing_time)}</Text> },
      {
        title: '操作', key: 'action', width: 250,
        render: (record) => (
          record.status == 1 ?
            <Space size="middle">
              <Button type="primary" size={'small'} icon={<AccountBookFilled />} onClick={() => this.onOpenBillDrawer(record)}>结算</Button>
            </Space> : <Text style={{ color: '#d3d3d3' }}>{record.status === 2 ? '已被删除' : '已停播'}</Text>
        ),
      },
    ];

    this.state = {
      datas: [],
      pagination: { current: 1, size: 0, total: 0, },
      // search
      status_settlein_options: [{ label: '在播', value: 1 }, { label: '停播', value: 0 }, { label: '已删除', value: 2 }],
      settlein_status: [1],
      search: { status: 1 },
      // 结算相关
      billDrawerVisible: false,
      current_settlein: {},
      // 事件选择
      startOfDate: moment().subtract(7, 'days').startOf('day'),
      endOfDate: moment().endOf('day')
    }
  }

  componentDidMount = () => {
    this.nextPage(1);
  }

  nextPage = (page = 1, size = 10) => {
    const _this = this
    const query = { page, size, query: this.state.search }
    SettleinServices.q(query, function (res) {
      if (res) {
        _this.setState({ datas: res.data, pagination: res.pagination })
      }
    })
  }


  SettleinStatusRef = React.createRef()

  onSettleinStatusChange = (values) => {
    let search = this.state.search;
    var $or = []
    if (values.length < 1) {
      values = [1];
      this.SettleinStatusRef.current.blur();
    }

    values.map(status => {
      $or.push({ status })
      return status
    })
    delete search.status
    this.setState({ search: Object.assign(search, { $or }), settlein_status: values })
    this.nextPage()
  }

  // Bill 页面开启

  onOpenBillDrawer = (record) => {
    this.setState({ billDrawerVisible: true, current_settlein: record })
  }
  onCloseBillDrawer = (record) => {
    this.setState({ billDrawerVisible: false })
  }
  onClearingSuccess = () => {
    this.nextPage()
  }

  onDateChange = (date, dateStr) => {
    if (date) {
      this.setState({ startOfDate: date[0].startOf('day'), endOfDate: date[1].endOf('day') })
    } else {
      this.setState({ startOfDate: moment().subtract(7, 'days').startOf('day'), endOfDate: moment().endOf('day') })
    }
  }

  // 导出Excel
  exportExcel = () => {
    const _this = this;
    const wb = XLSX.utils.book_new();
    SettleinServices.excel({ startOfDate: _this.state.startOfDate, endOfDate: _this.state.endOfDate, aaa: 'bbbb' }, function (res) {
      if (res && res.datas.length > 0) {
        const jsonWs = XLSX.utils.json_to_sheet(formatExcel(res.datas, _this.state.startOfDate, _this.state.endOfDate));
        XLSX.utils.book_append_sheet(wb, jsonWs, 'jsonWs');
        XLSX.writeFile(wb, 'fileName.xlsx');
      }
      console.log(res, wb)
    })
  }


  render() {
    return (
      <div>
        <Drawer push={{ distance: 800 }} width={650} visible={this.state.billDrawerVisible} onClose={this.onCloseBillDrawer} closable={false} >
          {
            this.state.billDrawerVisible && this.state.current_settlein && this.state.current_settlein._id ?
              < BillDrawer onClearingSuccess={this.onClearingSuccess} settlein={this.state.current_settlein} /> : <div>无信息</div>
          }
        </Drawer>
        <Space>
          <RangePicker onChange={this.onDateChange} />
          <Button type="primary" icon={<FileExcelFilled />} style={{ height: 30, justifyContent: 'center' }} onClick={this.exportExcel}>导出Excel</Button>
          <Select options={this.state.status_settlein_options} value={this.state.settlein_status} onChange={this.onSettleinStatusChange} ref={this.SettleinStatusRef} showSearch={false} onMouseDown={e => e.preventDefault()} mode="multiple" showArrow tagRender={tagRender} style={{ width: 225, }} />
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


const toDateStr = (date) => {
  const dateM = moment(date).startOf('day')
  const today = moment()
  if (today >= dateM) {
    return (
      <Tooltip title={
        <Text style={{ color: '#FFFFFF' }}>
          <Text style={{ color: '#FFFFFF' }}>距离下一次结算日期：{dateM.format('YYYY-MM-DD')}</Text><br />
          <Text style={{ color: '#FFFFFF' }}>已超出 {Math.abs(dateM.diff(today, 'days'))} 天</Text>
        </Text>
      }>
        <Text type="secondary">
          {
            dateM.diff(today, 'days') !== 0 ?
              <Text>
                <Text>超出</Text>
                <Text strong style={{ padding: '0 5px', color: '#1890ff' }}>{dateM.diff(today, 'days')}</Text>
                <Text> 天</Text>
              </Text> :
              <Text strong type="danger">请结算</Text>
          }
        </Text>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title={
        <Text style={{ color: '#FFFFFF' }}>
          <Text style={{ color: '#FFFFFF' }}>距离下一次结算日期：{dateM.format('YYYY-MM-DD')}</Text><br />
          <Text style={{ color: '#FFFFFF' }}>还剩 {dateM.diff(today, 'days')} 天</Text>
        </Text>
      }>
        <Text type="secondary">
          {
            dateM.diff(today, 'days') !== 0 ?
              <Text>
                <Text>还剩</Text>
                <Text strong style={{ padding: '0 5px', color: '#1890ff' }}>{dateM.diff(today, 'days')}</Text>
                <Text> 天</Text>
              </Text> :
              <Text strong type="success">请结算</Text>
          }
        </Text>
      </Tooltip>
    )
  }

}





export default App;



const formatExcel = (dates, startOfDate, endOfDate) => {
  const daySort = {}
  const diff = startOfDate.diff(endOfDate, 'days')
  for (let i = 0; i < -diff + 1; i++) {
    daySort[moment(startOfDate).add(i, 'days').format('MM-DD')] = ''
  }
  console.log(daySort)
  var arr = []
  dates.map((data) => {
    // 基本信息表头
    const info = {
      '昵称': data.settlein[0].platform_name,
      '账号实名': data.user[0].name,
      '平台账号ID': data.settlein[0].platform_key,
      '游戏ID': data.settlein[0].game_key,
      '主播对应': data.company[0].address,
    }
    // 附加信息
    let attach = { ...daySort }
    if (data.tasks.length > 0) {
      data.tasks.map((task, index) => {
        console.log(attach)
        const timeMS = new Date(new Date(moment().startOf('day')).getTime() + task.work_time * 1000)
        const formatTaskTime = moment(task.create_at).format('MM-DD')
        attach = Object.assign(attach, { [formatTaskTime]: moment(timeMS).format('H:mm:ss') })
      })
    }
    //结尾
    const other = {
      '均场观': data.dau_avg ? parseInt(data.dau_avg) : 0
    }

    console.log('---------------------------')
    const newInfo = Object.assign(info, attach, other)
    arr.push(newInfo)
  })
  console.log(arr)
  return arr
}