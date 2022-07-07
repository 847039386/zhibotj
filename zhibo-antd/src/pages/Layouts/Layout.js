import './Layout.css';
import React, { useState } from 'react';
import { Layout, Menu, Input } from 'antd';
import { UserPage, GamePage, CompanyPage, PlatformPage, WorkPage, SettleinPage, HomePage } from '../index'
import { Route, Switch, NavLink } from 'react-router-dom';
import { RobotFilled, ContactsFilled, CodepenSquareFilled, BankFilled, HomeFilled, CalendarFilled, SnippetsFilled, FundFilled, AppstoreFilled } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@ant-design/pro-components/dist/components.css';

const { Header, Sider, Content, Footer } = Layout;

// const items = [
//   { label: <NavLink to={"/"}>首页</NavLink>, path: '/', key: 'homePath', component: HomePage, icon: <HomeFilled />, },
//   { label: <NavLink to={"/user"}>用户</NavLink>, path: '/user', key: 'userPath', component: UserPage, icon: <UserOutlined />, },
//   { label: <NavLink to={"/company"}>公司</NavLink>, path: '/company', key: 'companyPath', component: CompanyPage, icon: <HomeOutlined />, },
//   { label: <NavLink to={"/game"}>游戏</NavLink>, path: '/game', key: 'gamePath', component: GamePage, icon: <RobotOutlined />, },
//   { label: <NavLink to={"/platform"}>平台</NavLink>, path: '/platform', key: 'platformPath', component: PlatformPage, icon: <GithubOutlined />, },
//   { label: <NavLink to={"/work"}>工作</NavLink>, path: '/work', key: 'workPath', component: WorkPage, icon: <GithubOutlined />, },
//   { label: <NavLink to={"/settlein"}>SettleinPage</NavLink>, path: '/settlein', key: 'settleinPath', component: SettleinPage, icon: <GithubOutlined />, },
// ]

const items = [
  { label: <NavLink to={"/"}>首页</NavLink>, path: '/', key: 'homePath', component: HomePage, icon: <HomeFilled />, },
  {
    label: '基本信息', icon: <AppstoreFilled />, children: [
      { label: <NavLink to={"/user"}>用户</NavLink>, path: '/user', key: 'userPath', component: UserPage, icon: <ContactsFilled />, },
      { label: <NavLink to={"/company"}>公司</NavLink>, path: '/company', key: 'companyPath', component: CompanyPage, icon: <BankFilled />, },
      { label: <NavLink to={"/game"}>游戏</NavLink>, path: '/game', key: 'gamePath', component: GamePage, icon: <RobotFilled />, },
      { label: <NavLink to={"/platform"}>平台</NavLink>, path: '/platform', key: 'platformPath', component: PlatformPage, icon: <CodepenSquareFilled />, },
    ]
  },
  {
    label: '工作区', icon: <FundFilled />, children: [
      { label: <NavLink to={"/settlein"}>入驻列表</NavLink>, path: '/settlein', key: 'settleinPath', component: SettleinPage, icon: <SnippetsFilled />, },
    ]
  },
  { label: <NavLink to={"/work"}>每日任务</NavLink>, path: '/work', key: 'workPath', component: WorkPage, icon: <CalendarFilled />, },

]


const App = () => {

  return (
    <Layout hasSider>
      <Sider trigger={null} collapsible style={{
        overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,
      }}>
        <div className="mylayout-logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']} items={items} />
      </Sider>
      <Layout className="mysite-layout" style={{ marginLeft: 200, backgroundColor: '#F0F2F5', minHeight: 1000 }} >
        {/* <Header style={{ background: '#FFFFFF', padding: 0, }}> </Header> */}
        <Content className="mysite-layout-background" style={{ backgroundColor: '#F0F2F5' }}  >
          <div className="site-layout-background" style={{ padding: 24, minHeight: '80vh' }} >
            <Switch  >
              <Route path="/user" key={'userPath'} component={UserPage}></Route>
              <Route path="/company" key={'companyPath'} component={CompanyPage}></Route>
              <Route path="/game" key={'gamePath'} component={GamePage}></Route>
              <Route path="/platform" key={'platformPath'} component={PlatformPage}></Route>
              <Route path="/work" key={'workPath'} component={WorkPage}></Route>
              <Route path="/settlein" key={'settleinPath'} component={SettleinPage}></Route>
              <Route path="/home" key={'HomePath'} component={HomePage} ></Route>
              <Route path="/" key={'defaultPath'} component={HomePage} ></Route>
            </Switch>
          </div>
          <DefaultFooter copyright="2022 定制直播管理系统" />
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;








