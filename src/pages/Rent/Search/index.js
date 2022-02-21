import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity, API } from '../../../utils'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value
  // 定时器id
  timerId = null

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  /* 
    传递小区数据：

    1 给搜索列表项添加单击事件。
    2 在事件处理程序中，调用 history.replace() 方法跳转到发布房源页面。
    3 将被点击的小区信息作为数据一起传递过去。

    4 在发布房源页面，判断 history.loaction.state 是否为空。
    5 如果为空，不做任何处理。
    6 如果不为空，则将小区信息存储到发布房源页面的状态中。
  */
  onTipsClick = item => {
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community
    })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        // 给li添加点击事件，当点击该项目时路由切换到/rent/add页面，并且传递当前的小区信息到该页面
        onClick={() => this.onTipsClick(item)}
      >
        {item.communityName}
      </li>
    ))
  }

  /* 
    关键词搜索小区信息
  */
  handleSearchTxt = (value) => {
    this.setState({
      searchTxt: value
    })
    if (!value) {
      return this.setState({
        tipsList: [],
      })
    }
    // 防抖处理：时间间隔少于500ms，不发送请求，不渲染新的列表
    // 先清除上一次的定时器
    clearTimeout(this.timerId)
    // 开启定时器
    this.timerId = setTimeout(async () => {
      const res = await API.get('area/community', {
        params: {
          name: value,
          id: this.cityId,
        }
      })
      this.setState({
        tipsList: res.data.body,
      })
    }, 500)
  }


  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleSearchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}