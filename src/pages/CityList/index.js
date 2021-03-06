import React from 'react';
import { Toast } from 'antd-mobile';
import { AutoSizer, List } from 'react-virtualized';
import axios from 'axios';
import './index.scss';
import { getCurCity } from '../../utils/index.js';
import NavHeader from '../../components/NavHeader';


// 处理列表数据
const formatCityData = (list) => {
  let res = new Object();
  let right = new Array();
  for (let item of list) {
    if (res.hasOwnProperty(item.short[0])) {
      res[item.short[0]].push(item)
    } else {
      res[item.short[0]] = [item]
    }
  }
  right = Object.keys(res).sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))
  return [res, right]
}

const titleHeight = 36

const nameHeight = 50

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {

  // 在constructor中创建ref对象
  constructor(props) {
    super(props)

    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    }

    // 创建ref实例
    this.cityListComponent = React.createRef()
  }

  // 获取列表数据
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1');
    const [cityList, cityIndex] = formatCityData(res.data.body);
    const hotCity = await axios.get('http://localhost:8080/area/hot');
    cityList['hot'] = hotCity.data.body;
    cityIndex.unshift('hot');
    const curCity = await getCurCity();
    cityList['#'] = [curCity];
    cityIndex.unshift('#');
    this.setState({
      cityList,
      cityIndex,
    })
  }

  // 动态计算每一行的高度
  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    return titleHeight + cityList[cityIndex[index]].length * nameHeight
  }

  // 获取点击城市名称后切换城市的数据
  async changeCity({ label, value }) {
    // const res = await axios.get('http://localhost:8080/area/info')
    if (HOUSE_CITY.indexOf(label) > -1) {
      // 将获取到的数据再存到本地存储中，以字符串的形式，通过JSON.stringify()
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      // 返回到上一页
      this.props.history.go(-1)
    } else {
      { Toast.info('抱歉，该城市无房源信息', 1); }
    }
  }

  // 每一行的渲染
  rowRenderer = ({
    key,
    index,
    isScrolling,
    isVisible,
    style
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className='city'>
        <div className='title'>{letter === '#' ? '当前定位' : (letter === 'hot' ? '热门城市' : letter.toUpperCase())}</div>
        {
          cityList[letter].map(item => <div className='name' key={item.value} onClick={() => this.changeCity(item)}>{item.label}</div>)
        }
      </div>
    )
  }

  // 用于获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    const { activeIndex } = this.state
    if (startIndex !== activeIndex) {
      this.setState({
        activeIndex: startIndex,
      })
    }
  }

  // 渲染右侧索引的方法
  renderCityIndex() {
    const { cityIndex } = this.state
    return cityIndex.map((item, index) => (
      <li
        className='city-index-item'
        key={item}
        onClick={() => {
          // 获取当前的List的实例对应的scrollToRow方法
          this.cityListComponent.current.scrollToRow(index)
        }}>
        <span className={this.state.activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
      </li>))
  }

  async componentDidMount() {
    await this.getCityList()

    // 调用List的measureAllRows方法，提前计算List中每一行的高度，实现scrollToRow的精确跳转
    this.cityListComponent.current.measureAllRows()
  }


  render() {
    return (
      <div className='citylist'>
        <NavHeader>
          城市选择
        </NavHeader>
        {this.state.cityIndex.length ?
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={this.cityListComponent}
                width={width}
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment='start'
              />
            )}
          </AutoSizer>
          : ''
        }

        {/* 右侧索引列表 */}
        <ul className='city-index'>
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}