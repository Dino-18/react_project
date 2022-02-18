import React, { Component, createRef } from 'react'
// 添加属性校验
import PropTypes from 'prop-types'

import styles from './index.module.css'

class Sticky extends Component {
  // 创建ref对象
  placeholder = createRef()
  content = createRef()
  // scroll 事件的事件处理程序
  handleScroll = () => {
    // 先获取占位符DOM对象
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current

    // 获取DOM对象的top值（离顶部的距离）
    const { top } = placeholderEl.getBoundingClientRect()
    if (top < 0) {
      // 实现吸顶功能，给内容元素添加一个类名，通过classList得到样式集合,从styles里面获取fixed类名对应的样式
      contentEl.classList.add(styles.fixed)
      // 设置占位符的高度，避免跳动
      placeholderEl.style.height = this.props.height + 'px'
    } else {
      // 取消吸顶
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0px'
    }
  }

  // 监听浏览器的scroll事件
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  // 组件卸载时解绑事件
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder} />

        {/* 内容元素 */}
        <div ref={this.content}>
          {/* 通过props拿到Filter组件 */}
          {this.props.children}
        </div>
      </div>
    )
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired
}

export default Sticky