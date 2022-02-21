import axios from "axios";
import AMapLoader from '@amap/amap-jsapi-loader';

export const getCurCity = function () {
  // 从本地存储中获取数据：是字符串的形式，需要通过JSON.parse转化为对象
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  // 如果本地存储无数据则重新获取
  if (!localCity) {
    return new Promise((resolve, reject) => {
      AMapLoader.load({
        key: "dafbd66cd2b196a30d850680046cec13",     // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0",              // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.CitySearch'],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        const citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(async (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            try {
              const res = await axios.get(
                `http://localhost:8080/area/info?name=${result.city}`
              )
              // 将获取到的数据再存到本地存储中，以字符串的形式，通过JSON.stringify()
              localStorage.setItem('hkzf_city', JSON.stringify(res.data.body))
              // 异步操作成功，将获取成功的数据暴露到外面
              resolve(res.data.body)
            } catch (e) { // 获取定位城市失败
              reject(e)
            }
          }
        })
      })
    })
  }
  // 若本地有数据则直接返回一个成功的Promise对象。
  return Promise.resolve(localCity);
}

export { API } from './api'
export { BASE_URL } from './url'
export * from './isAuth'
export { getCity } from './city'