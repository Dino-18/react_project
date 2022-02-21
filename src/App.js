import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
// 导入城市选择和首页

// 使用动态组件的方式导入组件：
import Home from './pages/Home';
import AuthRoute from './components/AuthRoute';
// import CityList from './pages/CityList';
// import Map from './pages/Map';
// import Login from './pages/Login';
// import Favorite from './pages/Favorite';

// // 房屋详情页面
// import HouseDetail from './pages/HouseDetail';
// import Rent from './pages/Rent';
// import RentAdd from './pages/Rent/Add';
// import RentSearch from './pages/Rent/Search';

const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const Favorite = lazy(() => import('./pages/Favorite'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

function App() {
  return (
    <Router>
      {/* 配置导航菜单 */}

      {/* 配置路由 */}
      <Suspense fallback={<div className="route-loading">loading...</div>}>
        <Route path='/home' component={Home} />
        <Route path="/citylist" component={CityList} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <AuthRoute path="/map" component={Map} />

        {/* 房源详情的路由规则 */}
        <Route path="/detail/:id" component={HouseDetail} />

        <Route path="/login" component={Login} />

        <AuthRoute path="/favorite" component={Favorite} />
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </Suspense>
    </Router>
  );
}

export default App;
