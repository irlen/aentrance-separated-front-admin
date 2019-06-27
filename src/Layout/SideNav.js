/** @jsx jsx */
import React, { Component } from 'react'
import { Menu, Icon, Button } from 'antd'
import { withTheme } from 'emotion-theming'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import { routeOne } from '../Routes/routeConfig'

const SubMenu = Menu.SubMenu

class SideNav extends Component {
  state = {
    collapsed: true,
    openKeys:[]
  }
  componentDidMount(){
    this._isMounted = true
  }
  toggleCollapsed = () => {
    if(this._isMounted){
      this.setState({
        collapsed: !this.state.collapsed,
        openKeys: !this.state.collapsed?[]:this.state.openKeys
      },()=>{
        this.props.doToggle(this.state.collapsed)
      })
    }
  }

  onOpenChange = (openKeys)=>{
    if(this._isMounted){
      this.setState({
        openKeys
      })
    }
    if(openKeys.length === 1 || openKeys.length === 0){
      if(this._isMounted){
        this.setState({
          openKeys
        })
      }
      return
    }
    const latestOpenKey = openKeys[openKeys.length - 1]
    if(this._isMounted){
      this.setState({
        openKeys:[latestOpenKey]
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    let NavStyle = styled.div({
      background:"none"
    })
    const selectedKeys = []
    selectedKeys.push(this.props.location.pathname)
    return (
      <div>
        <div style={{padding: "10px",height:"80px"}}>
          <img src={this.state.collapsed?require("../asets/intimatelog.png"):require("../asets/INTIMATELOG.png")} height="36"/>
        </div>
        <NavStyle>
        <Menu
          selectedKeys={selectedKeys}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
          onOpenChange={this.onOpenChange}
          openKeys={this.state.openKeys}
        >
          {
            routeOne && routeOne.length>0?
            routeOne.map(item=>{
              return(
                <SubMenu
                  key={ item.key }
                  title={
                    <span>
                      <i className={ item.icon } aria-hidden="true"></i>
                      <Icon type="double-right" style={{color:"rgba(255,255,255,0)"}}/>
                      <span>{ item.name }</span>
                    </span>
                  }
                >
                {
                  item.routes && item.routes.length>0 && item.type==='two'?
                  item.routes.map(subItem=>{
                    return (
                      <SubMenu
                        key={ item.key }
                        title={
                          <span>
                            <i className={ item.icon } aria-hidden="true"></i>
                            <Icon type="double-right" style={{color:"rgba(255,255,255,0)"}}/>
                            <span>{ item.name }</span>
                          </span>
                        }
                      >
                        {
                          subItem.routes && subItem.routes.length>0?
                          subItem.routes.map(sub2item=>{
                            return (
                              <Menu.Item key={ sub2item.path }>
                                <NavLink to={ sub2item.path }> { sub2item.name } </NavLink>
                              </Menu.Item>
                            )
                          })
                          :
                          ''
                        }
                      </SubMenu>
                    )
                  })
                  :
                  ''
                }
                {
                  item.routes && item.routes.length>0?
                  item.routes.map(subItem=>{
                    return (
                      <Menu.Item  key={ subItem.path } onClick={this.selectedKeysChange} >
                        <NavLink to={ subItem.path }> { subItem.name } </NavLink>
                      </Menu.Item>
                    )
                  })
                  :
                  ''
                }
                </SubMenu>
              )


            })
            :
            ''
          }

        </Menu>
        <div style={{textAlign:"center",cursor:"pointer",color:"rgba(255,255,255,0.2)"}} onClick={this.toggleCollapsed}>
          {
            this.state.collapsed?
            <span>
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </span>
            :
            <span>
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
            </span>

          }
        </div>
        </NavStyle>
      </div>
    )
  }
}

export default withTheme(withRouter(SideNav))
