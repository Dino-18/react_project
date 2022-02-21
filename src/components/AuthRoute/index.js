import React from "react"
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from "../../utils"

export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        const isLogin = isAuth()
        if (isLogin) {
          // 将props传递给组件以便其获得history等
          return <Component {...props} />
        } else {
          return <Redirect to={{
            pathname: "/login", // 未登录跳转
            state: { from: props.location } // 登录成功后跳转
          }}
          />
        }
      }}
    />
  );
}