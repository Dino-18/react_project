import React, { useState } from 'react';
// 导入路由
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// 导入子组件
import News from '../News';
import HouseList from '../HouseList';
import Index from '../Index';
import Profile from '../Profile';
import { TabBar } from 'antd-mobile';
import './index.css';

const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  },
]

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
  };

  // 3. 监听路由切换事件
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  // 获取tabbar数据的方法
  renderTabBarItem() {
    return tabItems.map(item => <TabBar.Item
      title={item.title}
      key={item.title}
      icon={<i className={`iconfont ${item.icon}`}
      />
      }
      selectedIcon={<i className={`iconfont ${item.icon}`}
      />
      }
      selected={this.state.selectedTab === `${item.path}`}
      onPress={() => {
        this.setState({
          selectedTab: `${item.path}`,
        });
        this.props.history.push(`${item.path}`);
      }}
    />)
  }
  render() {
    return <div className='home'>
      {/* 渲染子路由的内容 */}

      <Route path="/home/news" component={News} />
      <Route path="/home/list" component={HouseList} />
      <Route exact path="/home" component={Index} />
      <Route path="/home/profile" component={Profile} />

      {/* 渲染TabBar内容 */}
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#21b97a"
        barTintColor="white"
        hidden={this.state.hidden}
        noRenderContent={true}
      >
        {this.renderTabBarItem()}
      </TabBar>
    </div>
  }
}