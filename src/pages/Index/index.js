import React from 'react';
import { Carousel, Flex, Grid } from 'antd-mobile';
import axios from 'axios';
import { getCurCity } from '../../utils/index.js';
import SearchHeader from '../../components/SearchHeader/index.js';
import './index.scss';
// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png';
import Nav2 from '../../assets/images/nav-2.png';
import Nav3 from '../../assets/images/nav-3.png';
import Nav4 from '../../assets/images/nav-4.png';

const navs = [{
  id: 1, src: Nav1, title: '整租', path: '/home/list'
}, {
  src: Nav2, title: '合租', path: '/home/list'
}, {
  src: Nav3, title: '地图找房'
}, {
  src: Nav4, title: '去出租'
}]

export default class Index extends React.Component {
  state = {
    // 轮播图状态数据
    swipers: [],
    isSwiperLoaded: false,

    // 租房小组数据
    groups: [],

    // 最新资讯数据
    news: [],
    curCityName: '上海',
  }

  // 1.1 获取轮播图数据方法
  async getSwipers() {
    const res = await axios.get("http://localhost:8080/home/swiper")
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded: true,
    })
  }

  // 3. 获取租房小组数据方法
  async getGroups() {
    const res = await axios.get("http://localhost:8080/home/groups")
    this.setState({
      groups: res.data.body,
    })
  }

  // 4. 获取最新资讯数据
  async getNews() {
    const res = await axios.get("http://localhost:8080/home/news")
    this.setState({
      news: res.data.body,
    })
  }

  async componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();
    const curCity = await getCurCity();
    this.setState({
      curCityName: curCity.label,
    })
  }

  // 1.2 渲染轮播图方法
  renderSwipers() {
    return (
      this.state.swipers.map(item => (
        <a
          key={item.id}
          href="http://www.baidu.com"
          style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
        >
          <img
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
            style={{ width: '100%', verticalAlign: 'top' }}
            onLoad={() => {
              // fire window resize event to change height
              window.dispatchEvent(new Event('resize'));
              this.setState({ imgHeight: 'auto' });
            }}
          />
        </a>
      ))
    )
  }

  // 2. 渲染导航菜单方法
  renderNav() {
    return (
      navs.map(item => (
        <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
          <img src={item.src} alt="" />
          <h2>{item.title}</h2>
        </Flex.Item>
      ))
    )
  }

  // 3. 渲染最新资讯的方法
  renderNews() {
    return (
      this.state.news.map((item) =>
        <div className='home-news' key={item.id}>
          <div className='home-news-img'>
            <img style={{ width: '120px' }} src={`http://localhost:8080${item.imgSrc}`}></img>
          </div>
          <div className='home-news-title'>
            <h2 style={{ fontSize: '15px' }}>{item.title}</h2>
            <div className='home-news-source'>
              <div>{item.from}</div>
              <div>{item.date}</div>
            </div>
          </div>
        </div>
      ))
  }

  render() {
    return (
      <div className='index'>
        <div className='swiper'>
          {/* 1. 轮播图 */}
          {
            this.state.isSwiperLoaded ?
              <Carousel
                autoplay={true}
                infinite
              >
                {this.renderSwipers()}
              </Carousel>
              : ''
          }
          {/* 6. 搜索框 */}
          <SearchHeader cityName={this.state.curCityName} />
        </div>
        {/* 2. 导航菜单 */}
        <Flex className='nav'>
          {this.renderNav()}
        </Flex>
        {/* 3. 租房小组 */}
        <div className='group'>
          <h3 className='group-title'>租房小组
            <span className='more'>更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 4. 最新资讯 */}
        <div className='news'>
          {this.renderNews()}
        </div>
      </div>
    );
  }
}
