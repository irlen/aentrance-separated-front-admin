/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { Menu, Icon } from 'antd'

import { routeOne } from '../Routes/routeConfig'


const { SubMenu } = Menu

class Header extends Component {
  state={
    current:'/app'
  }
  componentDidMount(){
    this._isMounted = true
  }
  componentWillReceiveProps(nextProps){
  }
  handleClick = e => {
    if(this._isMounted){
      this.setState({
        current: e.key,
      });
    }
  }
  generateNav = ()=>{
    const navList = []
    if(routeOne && routeOne.length>0){
      routeOne.map(item=>{
        if(item.routes && item.routes.length>0){
          const atomNav =  <SubMenu
            key={`one${item.key}`}
            title={
              <span className="submenu-title-wrapper">
                {item.name}
              </span>
            }
          >
            {
              item.routes.map(subItem=>{
                return <Menu.Item key={subItem.key}>
                        <Link to={subItem.path}>{subItem.name}</Link>
                      </Menu.Item>
              })

            }

          </SubMenu>
          navList.push(atomNav)
        }else{

          const atomNav = <Menu.Item key={`one${item.key}`}>
                            <Link to={item.path}>{item.name}</Link>
                          </Menu.Item>
          navList.push(atomNav)
        }
      })
    }
    return navList
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return (
      <div css={{display:"flex"}}>
        <div css={{flex:"0 0 120px",lineHeight:"60px",paddingLeft:"20px"}}>
          <Link to="/app">
            <img src={require('../asets/logo.png')} width="40" css={{cursor:"pointer"}}/>
          </Link>
        </div>
        <div css={{flex:"1 1 auto",paddingTop:"8px"}}>
          <Menu mode="horizontal" selectedKeys={[this.state.current]} onClick={this.handleClick}>
          {
            this.generateNav()
          }
          </Menu>
        </div>
      </div>
    )
  }
}

export default Header
