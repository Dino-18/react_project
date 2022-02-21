import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';

import { API } from '../../utils'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

  render() {

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl"></WhiteSpace>

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            {/* 账号 */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              >
              </Field>
            </div>
            <ErrorMessage className={styles.error} name="username" component="div"></ErrorMessage>

            {/* 密码 */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              >
              </Field>
            </div>
            <ErrorMessage className={styles.error} name="password" component="div"></ErrorMessage>

            {/* 登录按钮 */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  // 提供状态（相当于原来组件中的state）
  mapPropsToValues: () => ({ username: '', password: '' }),

  // 添加表单验证规则
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号为必填项')
      .matches(REG_UNAME, '长度为5-8位，只能出现数字、字母、下划线'),
    password: Yup.string()
      .required('密码为必填项')
      .matches(REG_PWD, '长度为5-12位，只能出现数字、字母、下划线'),
  }),

  // 表单提交事件
  // 无法从该方法中获取到this.props.history， 通过第二个参数获取props
  handleSubmit: async (values, { props }) => {
    const { username, password } = values

    const res = await API.post(`/user/login`, {
      username,
      password
    })

    const { status, body, description } = res.data

    if (status === 200) {
      localStorage.setItem('hkzf_token', body.token)
      // 通过用户记录的location判断当前是从哪里跳转来的（state）
      if (!props.location.state) {
        props.history.go(-1)
      } else {
        // push: [home, login, map]
        // replace: [home, map]
        // 用replace而不是push，否则点击回退又会重新跳转到登录页面
        props.history.replace(props.location.state.from.pathname)
      }
    } else {
      Toast.info(description, 2, null, false)
    }
  }
})(Login)

export default Login