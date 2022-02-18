import React from 'react';
import styles from './index.module.css';
import HouseItem from '../../components/HouseItem';
import { BASE_URL } from '../../utils/url';
import { API } from '../../utils/api';
import AMapLoader from '@amap/amap-jsapi-loader';
import NavHeader from '../../components/NavHeader';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';

export default class Map extends React.Component {
  // 在首次渲染之后初始化地图
  // 在脚手架中的全局对象需要通过window来访问，否则会造成ESLint报错，校验错误。
  constructor() {
    super();
    this.map = {};
    this.geocoder = {};
    this.state = {
      houseList: [],
      houseShow: false,
    }
  }
  // 2.dom渲染成功后进行map对象的创建
  componentDidMount() {
    // 3. 根据城市定位显示相应地图
    this.initMap()
  }

  // 初始化地图
  // 3.1 获取当前城市
  initMap() {
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

    AMapLoader.load({
      key: "dafbd66cd2b196a30d850680046cec13",                     // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0",              // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Geocoder', 'AMap.ToolBar', 'AMap.Scale',],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
      const map = new AMap.Map("container", { //设置地图容器id
        viewMode: "3D",         //是否为3D地图模式
        zoom: 11,                //初始化地图级别
        center: [105.602725, 37.076636], //初始化地图中心点位置
      });

      this.map = map

      this.AMap = AMap

      // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      map.addControl(new AMap.ToolBar({
        position: 'LT'
      }));
      // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
      map.addControl(new AMap.Scale({
        position: 'RT'
      }));

      // 3.2 使用地址解析器解析当前坐标
      const geocoder = new AMap.Geocoder({
        city: label,
      })
      geocoder.getLocation(label, async (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const location = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
          map.setZoomAndCenter(11, location, false)
          this.renderOverlays(value);
        }
      })
      map.on('movestart', () => {
        if (this.state.houseShow) {
          this.setState({
            houseShow: false
          })
        }
      })
    }).catch(e => {
      console.log(e);
    })
  }

  // 根据指定id获取房源数据
  async renderOverlays(id) {
    Toast.loading('Loading...', 0, null)
    const res = await API.get(`/area/map?id=${id}`)
    Toast.hide();

    res.data.body.forEach(item => {
      this.createOverlays(item)
    })
  }

  // 创建覆盖物
  createOverlays(item) {
    const { coord: { longitude, latitude }, label, value, count } = item
    const position = [longitude, latitude]
    const content = `<div class="${styles.bubble}"><p class="${styles.name}">${label}</p><p>${count}套</p></div>`;
    const marker = new this.AMap.Marker({
      position: position,
      content: content,
      cursor: 'point',
      offset: new this.AMap.Size(-35, -35),
    });

    marker.id = value
    //  添加单击事件

    const { type, nextZoom } = this.getTypeAndZoom(this.map)

    marker.on('click', () => {
      // 以当前点击的覆盖物为中心放大地图
      if (type === 'circle') {
        this.createCircle(nextZoom, position, value)
      } else {
        this.createRect(nextZoom, position, value)
      }
    })
    // 添加覆盖物
    this.map.add(marker);
  }

  // 获取类型和zoom
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let nextZoom, type
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
      // } else if (zoom >= 12 && zoom < 14) {
      //   nextZoom = 15
      //   type = 'circle'
    } else {
      nextZoom = 15
      type = 'rect'
    }
    return { type, nextZoom }
  }

  // 区以上点击事件
  createCircle(nextZoom, position, value) {
    this.map.setZoomAndCenter(nextZoom, position, false)
    this.map.clearMap()
    this.renderOverlays(value)
  }

  // 小区点击事件
  async createRect(nextZoom, position, value) {
    this.map.setZoomAndCenter(nextZoom, position, false)
    this.map.clearMap()
    Toast.loading('Loading...', 0, null)
    const res = await API.get(`/area/map?id=${value}`)
    Toast.hide()
    res.data.body.forEach(item => {
      const { coord: { longitude, latitude }, label, value, count } = item
      const position = [longitude, latitude]
      const content = `<div class="${styles.bubble_local}"><p class="${styles.name_local}">${label}${count}套</p></div>`;
      const marker = new this.AMap.Marker({
        position: position,
        content: content,
        cursor: 'point',
        offset: new this.AMap.Size(-50, -28),
      });
      marker.id = value
      this.map.add(marker);

      // 添加单击事件，获取小区房源数据
      marker.on('click', (e) => {
        this.getHouseList(value)
        const target = e.pixel
        this.map.panBy(
          window.innerWidth / 2 - target.x,
          (window.innerHeight - 330) / 2 - target.y
        )
      })
    })
  }

  async getHouseList(id) {
    Toast.loading('Loading...', 0, null)
    const res = await API.get(BASE_URL + `/houses?cityId=${id}`)
    Toast.hide()
    this.setState({
      houseList: res.data.body.list,
      houseShow: true,
    })
  }

  renderHousesList() {
    return (
      this.state.houseList.map((item) =>
        <HouseItem
          key={item.houseCode}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
        // <div className={styles.house} key={item.houseCode}>
        //   <div className={styles.imgWrap}>
        //     <img
        //       className={styles.img}
        //       src={BASE_URL + item.houseImg}
        //       alt=""
        //     />
        //   </div>
        //   <div className={styles.content}>
        //     <h3 className={styles.title}>{item.title}</h3>
        //     <div className={styles.desc}>{item.desc}</div>
        //     <div>
        //       {
        //         item.tags.map((tag, index) => {
        //           const tagClass = 'tag' + (index + 1)
        //           return (
        //             <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>
        //               {tag}
        //             </span>
        //           )
        //         })
        //       }
        //     </div>
        //     <div className={styles.price}>
        //       <span className={styles.priceNum}>{item.price}</span>元/月
        //     </div>
        //   </div>
        // </div>
      )
    )
  }

  render() {
    // 1.初始化创建地图容器,div标签作为地图容器，同时为该div指定id属性；
    return (
      <div className={styles.map}>
        <NavHeader>
          地图找房
        </NavHeader>
        <div id="container" className={styles.container} style={{ height: '800px' }} ></div>
        {/* 添加房源列表 */}
        <div className={this.state.houseShow ? [styles.houseList, styles.show].join(' ') : ''}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTittle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>
          <div className={styles.houseItems}>
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    );
  }
}