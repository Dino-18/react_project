import React, { Component } from 'react'
import FilterFooter from '../../../../components/FilterFooter'
import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.more
  }

  // 标签点击事件
  itemClick = (label) => {
    const newSelectedValues = [...this.state.selectedValues]
    const index = newSelectedValues.indexOf(label)
    // 如果包含
    if (index !== -1) {
      newSelectedValues.splice(index, 1)
    } else {
      newSelectedValues.push(label)
    }
    this.setState({
      selectedValues: newSelectedValues
    })
  }

  //  渲染标签项目
  renderFilters(data, tagActiveItems) {
    return data.map(item => {
      return (
        <span key={item.value} className={[styles.tag, tagActiveItems.includes(item.value) ? styles.tagActive : ''].join(' ')} onClick={() => this.itemClick(item.value)}>{item.label}</span>
      )
    })
  }

  // 点击清除事件
  onClear() {
    this.setState({
      selectedValues: []
    })
  }

  render() {
    const {
      data: { roomType, oriented, floor, characteristic }, onSave, type, onCancel
    } = this.props

    const tagActiveItems = this.state.selectedValues

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType, tagActiveItems)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented, tagActiveItems)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor, tagActiveItems)}</dd>

            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic, tagActiveItems)}</dd>
          </dl>
        </div>

        {/* 底部 */}
        <FilterFooter className={styles.footer} cancelText='清除' onCancel={() => this.onClear()} onOk={() => onSave(type, tagActiveItems)} />
      </div>
    )
  }
}