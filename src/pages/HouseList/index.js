import React from 'react'
import { Flex, Toast } from 'antd-mobile'
import { WindowScroller, AutoSizer, InfiniteLoader, List } from 'react-virtualized'

import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
import SearchHeader from '../../components/SearchHeader'
import NoHouse from '../../components/NoHouse'
import { getCurCity } from '../../utils'

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

import styles from './index.module.css'

// const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {

  // 初始化实例属性
  filters = {}
  // 初始化状态：列表数据和总条数
  state = {
    list: [],
    count: 0,
    isLoading: false, // 表示数据是否加载中
  }

  // 初始化城市名
  label = ''
  value = ''

  // 用来获取房屋列表数据
  async searchHouseList() {
    // 获取当前定位城市id
    Toast.loading('加载中', 0, null, false)
    this.setState({
      isLoading: true
    })
    // const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses`, {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })

    const { count, list } = res.data.body
    Toast.hide()
    this.setState({
      isLoading: false
    })

    // 提示房源数据
    if (count) {
      Toast.info(`共找到${count}套房源`, 2, null, false)
    } else {

    }

    this.setState({
      list: list,
      count: count
    })
  }

  // 创建一个onFilter方法来接收Filter传递过来的筛选数据
  onFilter = (filters) => {
    this.filters = filters
    // 返回页面顶部
    window.scrollTo(0, 0)
    // 调用房屋数据的方法
    this.searchHouseList()
  }

  // 每一行的渲染
  renderHouseList = ({
    key,
    index,
    style
  }) => {
    // 根据索引号获取当前行的房屋数据
    const { list } = this.state
    const house = list[index]

    // 判断house是否存在，如果不存在就渲染 loading 元素占位
    if (!house) {
      return <div key={key} style={style}>
        <p className={styles.loading}></p>
      </div>
    }
    return (
      <HouseItem
        key={key}
        onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 用来获取更多房屋列表数据，返回的是一个promise对象，这个对象应该在数据加载完成时变成已完成
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      // 数据加载完成时调用resolve方法
      // const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
      API.get(`/houses`, {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
        // 调用resolve完成
        resolve()
      })
    })
  }

  renderList() {
    const { count, isLoading } = this.state

    // 在数据加载完成后，再进行count的判断
    // 如果数据加载中则不展示NoHouse组件，当数据加载完成后，再展示NoHouse组件
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧</NoHouse>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) =>
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) =>
              <AutoSizer>
                {
                  ({ width }) =>
                    <List
                      autoHeight // 设置高度变成WIndowScroller最终渲染的列表高度
                      width={width}  // 视口的宽度
                      height={height} // 视口的高度，告诉List需要渲染多少条数据
                      ref={registerChild}
                      onRowsRendered={onRowsRendered}
                      rowCount={count} // list列表项的行数
                      rowHeight={120} // 每一行的高度
                      rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      className={styles.houses}
                    />
                }
              </AutoSizer>
            }
          </WindowScroller>
        }
      </InfiniteLoader>
    )
  }

  // 初始化一个属性filters，避免一进来页面时filters为undefined，无法发送请求
  async componentDidMount() {
    const { label, value } = await getCurCity()
    this.label = label
    this.value = value
    this.searchHouseList()
  }

  render() {
    return <div>
      {/* 导航栏 */}
      <Flex direction='row' className={styles.header}>
        <i className='iconfont icon-back' onClick={() => this.props.history.go(-1)}></i>
        <SearchHeader cityName={this.label} className={styles.searchHeader} />
      </Flex>
      {/* 筛选栏 */}
      <Sticky height={40}>
        <Filter onFilter={this.onFilter} />
      </Sticky>
      {/* 房屋列表 */}
      <div className={styles.houseItems}>{this.renderList()}</div>
    </div>
  }
}