import React from 'react';
import Tools from '../../utils/tools';
import { Space, Table, Button, Col, Input, Row, Badge, Divider, Select, Tag, Typography } from 'antd';
import { PlusOutlined, DeleteFilled, HighlightFilled } from '@ant-design/icons';
import { CompanyServices } from '../../services';
import { addMsg, rmModal, rmMsg, utMsg } from '../../utils/modal'
import GeneralComponent from '../../component/GeneralComponent'
import { CompanyFormat, DefaultCompanyValues } from './data'



class App extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      { title: '公司名称', key: 'name', render: data => <span><Badge status={data.status === 1 ? 'processing' : 'default'}></Badge><Typography.Text style={{ color: data.status !== 2 ? '#00000' : '#d3d3d3' }}>{data.name}</Typography.Text></span> },
      { title: '地址', dataIndex: 'address', key: 'address', },
      {
        title: '操作', key: 'action', width: 250,
        render: (text, record, index) => (
          record.status < 2 ?
            <Space size="middle">
              <Button type="primary" size={'small'} icon={<HighlightFilled />} onClick={() => this.onCompanyModalOpen(record)}>修改</Button>
              <Button type="primary" danger size={'small'} icon={<DeleteFilled />} onClick={() => this.rmData(record)}>删除</Button>
            </Space> : <Typography.Text style={{ color: '#d3d3d3' }}>已被删除</Typography.Text>
        ),
      },
    ];




    this.state = {
      datas: [{ _id: "KSI" }],
      pagination: { current: 1, size: 0, total: 0, },
      // search
      status_company_options: [{ label: '合作中', value: 1 }, { label: '合作终止', value: 0 }, { label: '已删除', value: 2 }],
      company_status: [1],
      search: { status: 1 },
      //  创建或修改所需要的值
      CompanyModal: { title: null, tip: null },
      current_CompanyID: null,
      initialCompanyValues: DefaultCompanyValues,
      CompanyModalVisible: false,
    }
  }


  componentDidMount = () => {
    this.nextPage(1);
  }

  nextPage = (page = 1, size = 10) => {
    const _this = this
    const query = { page, size, query: this.state.search }
    CompanyServices.q(query, function (res) {
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
      CompanyServices.h({ id }, (data) => {
        if (data) {
          rmMsg('公司表', record.principal);
          _this.nextPage(currentPage)
        }
      })
    })
  }

  // search
  onSearchCompanyNameChange = (e) => {
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

  companyStatusRef = React.createRef()

  onCompanyStatusChange = (values) => {
    let search = this.state.search;
    var $or = []
    if (values.length < 1) {
      values = [1];
      this.companyStatusRef.current.blur();
    }

    values.map(status => {
      $or.push({ status })
      return status
    })
    delete search.status
    this.setState({ search: Object.assign(search, { $or }), company_status: values })
    this.nextPage()
  }

  // Modal模块的FUN START
  CompanyRef = React.createRef();
  onCompanyModalOpen = async (record) => {
    await this.setState({ CompanyModalVisible: true })
    record._id ? await this.setState({ current_CompanyID: record._id, CompanyModal: { title: '修改公司', tip: `编号：${record._id}` } }) : await this.setState({ current_CompanyID: null, CompanyModal: { title: '创建公司', tip: '公司名不许为空哦' } })
    record ? this.CompanyRef.current.setFieldsValue(record) : this.CompanyRef.current.setFieldsValue(DefaultCompanyValues)
  }

  onCompanyModalClose = () => {
    this.setState({ CompanyModalVisible: false })
  }

  onCompanyFormFinish = async (formValues) => {
    formValues = Object.assign(formValues, { szm: Tools.getFirstLetter(formValues.name) })
    this.state.current_CompanyID ? await CompanyServices.ut(Object.assign(formValues, { id: this.state.current_CompanyID })) : await CompanyServices.ct(formValues)
    await this.nextPage(this.state.pagination.current);
    await Tools.waitTime(1000)
    await this.onCompanyModalClose();
    this.state.current_CompanyID ? utMsg('公司表', formValues.name) : addMsg('公司表', formValues.name)
  }
  // Modal模块的FUN END

  render() {
    return (
      <div>
        <GeneralComponent width={500} title={this.state.CompanyModal.title} titleTip={this.state.CompanyModal.tip} ref={this.CompanyRef} format={CompanyFormat} onFinish={this.onCompanyFormFinish} onClose={this.onCompanyModalClose} initialValues={this.state.initialCompanyValues} visible={this.state.CompanyModalVisible} />
        <Space>
          <Button type="primary" icon={<PlusOutlined />} style={{ height: 30, justifyContent: 'center' }} onClick={this.onCompanyModalOpen}>添加公司</Button>
          <Input onChange={this.onSearchCompanyNameChange} placeholder={'请输入公司名称'} />
          <Select options={this.state.status_company_options} value={this.state.company_status} onChange={this.onCompanyStatusChange} ref={this.companyStatusRef} showSearch={false} onMouseDown={e => e.preventDefault()} mode="multiple" showArrow tagRender={tagRender} style={{ width: 225, }} />
        </Space>
        <Divider></Divider>
        <Table bordered columns={this.columns} dataSource={this.state.datas} rowKey="_id" style={{ tableLayout: 'fixed' }}
          expandable={{
            expandedRowRender: (record) => (

              <div >
                <div style={{ padding: '10px 0' }}>
                  <Row gutter={24}>
                    <Col span={2} style={{ textAlign: 'right' }}>负责人：</Col>
                    <Col span={22}>{record.principal}</Col>
                  </Row>
                </div>
                <div style={{ borderTop: '1px dashed #B0AFAD', borderBottom: '1px dashed #B0AFAD', padding: '10px 0' }}>
                  <Row gutter={24} >
                    <Col span={2} style={{ textAlign: 'right' }}>联系方式：</Col>
                    <Col span={22}>{record.phone}</Col>
                  </Row>
                </div>
                <div style={{ padding: '10px 0' }}>
                  <Row gutter={24}>
                    <Col span={2} style={{ textAlign: 'right', }}>备注：</Col>
                    <Col span={22}>{record.description}</Col>
                  </Row>
                </div>
              </div>
            ),
          }}
          pagination={{ current: this.state.pagination.current, total: this.state.pagination.total, onChange: this.nextPage, pageSize: 10, showSizeChanger: false, responsive: false, hideOnSinglePage: true, position: ['bottomCenter'] }} />
      </div>
    );
  }
}

const tagRender = (props) => {
  const { label, value } = props;
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