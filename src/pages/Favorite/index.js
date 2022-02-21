import React, { Component } from 'react'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'

import { API, getToken, BASE_URL } from '../../utils'

class Favorite extends Component {
  state = {
    favList: []
  }

  getFavList = async () => {
    const res = await API.get('user/favorites', {
      headers: {
        authorization: getToken()
      }
    })
    this.setState({
      favList: res.data.body
    })
  }

  renderHouseList = () => {
    const { favList } = this.state

    if (!favList.length) {
      return (<NoHouse>没有收藏房源</NoHouse>)
    } else {
      return (
        favList.map((item) => {
          return (<HouseItem
            key={item.houseCode}
            onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
            src={BASE_URL + item.houseImg}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}
          />)
        }))
    }
  }

  componentDidMount() {
    this.getFavList()
  }

  render() {
    return (
      <div>
        <NavHeader>我的收藏</NavHeader>
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Favorite