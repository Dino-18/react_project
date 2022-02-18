import React, { Component } from 'react'
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'
import FilterTitle from '../FilterTitle'

import { Spring, animated } from 'react-spring'

// 导入自定义axios
import { API } from '../../../../utils/api'
import styles from './index.module.css'
// import { object } from 'prop-types'


const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },

    // 控制FilterPicker和FilterMore组件的展示与隐藏
    openType: '',

    // 筛选条件数据
    filtersData: {},

    // 筛选条件的选中值
    selectedValues
  }

  componentDidMount() {
    // 拿到body
    this.htmlBody = document.body
    this.getFiltersData()
  }

  onTitleClick = (type) => {
    // 给body添加样式
    this.htmlBody.className = 'body-fixed'

    const { titleSelectedStatus, selectedValues } = this.state

    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 遍历标题选中状态对象
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        newTitleSelectedStatus[type] = true
      } else {
        const selectedVal = selectedValues[key]
        if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
          // 证明区域部分有被选中
          newTitleSelectedStatus[key] = true
        } else if ((key === 'mode' || key === 'price') && selectedVal[0] !== 'null') {
          newTitleSelectedStatus[key] = true
        } else if (key === 'more' && selectedVal.length) {
          // 更多选择项
          newTitleSelectedStatus[key] = true
        } else {
          newTitleSelectedStatus[key] = false
        }
      }
    })

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      // 展示对话框
      openType: type
    })
  }

  // 隐藏对话框
  onCancel = (type) => {
    this.htmlBody.className = ''

    const { titleSelectedStatus, selectedValues } = this.state

    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    const selectedVal = selectedValues[type]
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 证明区域部分有被选中
      newTitleSelectedStatus[type] = true
    } else if ((type === 'mode' || type === 'price') && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length) {
      // 更多选择项
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }

  // 点击确定隐藏对话框
  onSave = (type, value) => {
    this.htmlBody.className = ''
    // 菜单高亮的逻辑处理 点击确定按钮时确定当前是否选中
    const { titleSelectedStatus } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    const selectedVal = value

    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      // 证明区域部分有被选中
      newTitleSelectedStatus[type] = true
    } else if ((type === 'mode' || type === 'price') && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length) {
      // 更多选择项
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    // 拿到最新的选中值
    const newSelectedValues = {
      ...this.state.selectedValues,
      // 只更新当前type对应的选中值
      [type]: value
    }

    const { area, mode, price, more } = newSelectedValues

    // 创建筛选条件数据
    const filters = {}
    //  区域（area或者subway）
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue
    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0] !== 'null' ? price[0].match(new RegExp("[0-9]+"))[0] : 'null'
    // 更多
    filters.more = more.join(',')

    // 调用父组件中的方法，将筛选数据传递给父组件
    this.props.onFilter(filters)

    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues,
    })
  }

  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)

    this.setState({
      filtersData: res.data.body
    })
  }

  // 渲染filterpicker组件的方法
  renderFilterPicker() {
    const { openType, filtersData: { area, subway, rentType, price }, selectedValues } = this.state

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    // 根据openType来拿到当前筛选条件数据
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        data = rentType
        cols = 1
        break;
      case 'price':
        data = price
        cols = 1
        break;
      default:
        break
    }
    return <FilterPicker onCancel={this.onCancel} onSave={this.onSave} data={data} cols={cols} type={openType} defaultValue={defaultValue} key={openType} />
  }

  // 渲染FilterMore组件
  renderFilterMore() {
    const { openType, filtersData: { roomType, oriented, floor, characteristic }, selectedValues } = this.state

    const data = { roomType, oriented, floor, characteristic }

    const more = selectedValues.more

    if (openType === 'more') {
      return <FilterMore data={data} type={openType} onSave={this.onSave} more={more} onCancel={this.onCancel} />
    }
  }

  // 渲染遮罩层div
  renderMask() {
    const { openType } = this.state

    const isHide = (openType === 'more' || openType === '')
    return (
      // 通过to控制遮罩层的显示和隐藏，当openType为空或more时不显示（opacity=0，依然在文档流中）
      <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} >
        {props => {
          // 说明遮罩层已经完成动画效果，隐藏了
          // if (props.opacity === 0) {
          //   // return null
          //   console.log('null')
          // }
          if (!isHide) {
            return (
              <animated.div
                style={props}
                className={styles.mask}
                onClick={() => this.onCancel(openType)}
              >
              </animated.div>
            )
          }
          return null
        }}
      </Spring>
    )
  }

  render() {
    const { titleSelectedStatus } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          this.renderMask()
        }
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onTitleClick={this.onTitleClick} />
          {/* 前三个弹出框 */}
          {this.renderFilterPicker()}
          {/* 最后一个筛选栏 */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}