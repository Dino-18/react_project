import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
// 导入城市选择和首页
import Home from './pages/Home';
import CityList from './pages/CityList';
import Map from './pages/Map';

// 房屋详情页面
import HouseDetail from './pages/HouseDetail';


function App() {
  return (
    <Router>
      {/* 配置导航菜单 */}
      {/* <ul>
        <li>
          <Link to="/home">首页</Link>
        </li>
        <li>
          <Link to="/citylist">城市选择</Link>
        </li>
      </ul> */}

      {/* 配置路由 */}
      <Route path='/home' component={Home} />
      <Route path="/citylist" component={CityList} />
      <Route exact path="/" render={() => <Redirect to="/home" />} />
      <Route path="/map" component={Map} />

      {/* 房源详情的路由规则 */}
      <Route path="/detail/:id" component={HouseDetail} />
    </Router>
  );
}

export default App;
