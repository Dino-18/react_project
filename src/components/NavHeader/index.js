import React from 'react';
import { withRouter } from 'react-router-dom';
import { NavBar, Icon } from 'antd-mobile';
import './index.scss';
// 导入props校验的包
import PropTypes from 'prop-types';
import styles from './index.module.css';

// 在这里直接将children和history解构出来，onLeftClick接受用户自定义点击回调
function NavHeader({ children, history, onLeftClick, className, rightContent }) {
  const defaultHander = () => history.go(-1)
  return (
    <NavBar
      mode="light"
      className={[styles.navBar, className || ''].join(' ')}
      icon={<Icon type="left" style={{ color: '#9c9fa1' }} />}
      onLeftClick={onLeftClick || defaultHander}
      style={{ background: '#f6f5f6', color: '#9c9fa1' }}
      rightContent={rightContent}
    >
      {children}
    </NavBar>)
}

// 添加props校验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func
}

// withRouter函数的返回值也是组件（高阶组件）
export default withRouter(NavHeader)


