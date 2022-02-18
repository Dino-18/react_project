import React from "react"
import { Flex } from "antd-mobile"
import propTypes from "prop-types"
import { withRouter } from "react-router-dom"
import './index.scss'

function SearchHeader({ cityName, history, className }) {
  return (
    <Flex className={['search-box', className || ''].join(' ')}>
      <Flex className='search'>
        {/* 6.1 城市选择 */}
        <div className='location' onClick={() => history.push('/citylist')}>
          <span className='name'>
            {cityName}
          </span>
          <i className='iconfont icon-arrow'></i>
        </div>

        {/* 6.2 搜索框 */}
        <div className='form' onClick={() => history.push('/search')}>
          <i className='iconfont icon-search'></i>
          <span className='text'>请输入小区或地址</span>
        </div>
      </Flex>

      {/* 6.3 地图找房 */}
      <i className='iconfont icon-map' onClick={() => history.push('/map')}></i>
    </Flex>
  )
}

// 添加属性校验
SearchHeader.propTypes = {
  cityName: propTypes.string.isRequired
}

export default withRouter(SearchHeader)