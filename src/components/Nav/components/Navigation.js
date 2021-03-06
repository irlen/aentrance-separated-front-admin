import React from 'react'
import { Menu, Icon, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import $ from 'jquery'

import { routeOne } from '../../../Routes/routeConfig'
const SubMenu = Menu.SubMenu;
class Navigation extends React.Component {
  state = {
    collapsed: true,
    selectedKeys: [],
    pageAuth: [],
    authNavList:[]
  }
  // getAuthNav = ()=>{
  //   let authRoute = _.cloneDeep(routeOne)
  //   const authList = []
  //   let compiledRoute = []
  //   const authNavList = []
  //   if(this.state.pageAuth && this.state.pageAuth.length>0){
  //     this.state.pageAuth.map(item=>{
  //       authList.push(item.path)
  //     })
  //   }
  //   if(authRoute && authRoute.length>0){
  //     //生成新的nav列表，存入compiledRoute
  //     authRoute.map(item=>{
  //       if(!item.routes){
  //         if(authList.indexOf(item.path) === -1){
  //           compiledRoute.push(item)
  //         }
  //       }else if(item.routes){
  //         const oneItem = []
  //         if(item.routes && item.routes.length>0){
  //           item.routes.map(subItem=>{
  //             if(authList.indexOf(subItem.path) === -1){
  //               oneItem.push(subItem)
  //             }
  //           })
  //         }
  //         const menu = _.cloneDeep(item)
  //         menu.routes = oneItem
  //         compiledRoute.push(menu)
  //       }
  //     })
  //   }
  //   if(compiledRoute && compiledRoute.length>0){
  //     compiledRoute.map(item=>{
  //       if(!item.routes){
  //         authNavList.push(item)
  //       }else if(item.routes && item.routes.length>0){
  //         authNavList.push(item)
  //       }
  //     })
  //   }
  //   this.setState({
  //     authNavList
  //   })
  // }
  componentDidMount(){
    //const localPageAuth = JSON.parse(localStorage.getItem('userAuth')).pageAuth
    // const localPageAuth = JSON.parse(localStorage.getItem('userAuth')).pageAuth
    // this.setState({
    //   selectedKeys: [this.props.path],
    //   pageAuth: this.props.pageAuth?this.props.pageAuth:localPageAuth
    // },()=>{
    //   this.getAuthNav()
    // })
  }

  componentWillReceiveProps(nextProps){
    // if(this.props.pageAuth !== nextProps.pageAuth){
    //   this.setState({
    //     pageAuth: nextProps.pageAuth
    //   },()=>{
    //     this.getAuthNav()
    //   })
    // }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    },()=>{
      this.props.setNavResize()
    });
    this.props.laystate(this.state.collapsed)
    $(window).trigger("resize");
  }


  selectedKeysChange = (value)=>{
    const curKey = []
    curKey.push(value.key)

    this.setState({
      selectedKeys:[...curKey]
    })
  }
  openKeysChange = ()=>{
    console.log("haha")
  }

  render() {
    const authNavList = this.state.authNavList
    return (
      <Scrollbars
        autoHide
        autoHideTimeout={100}
        autoHideDuration={200}
        className="navContainer"
      >
        <Button type="primary" onClick={this.toggleCollapsed} style={{ margin: 5}}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <Menu
          selectedKeys={this.state.selectedKeys}
          mode="inline"
          inlineCollapsed={this.state.collapsed}
        >
        {
          authNavList && authNavList.length>0?
          authNavList.map(item=>{
            if(!item.routes){
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
                  <Menu.Item onClick={this.selectedKeysChange} key={ item.key }>
                    <NavLink to={ item.path }> { item.name } </NavLink>
                  </Menu.Item>
                </SubMenu>
              )
            }else if(item.routes){
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
                  item.routes && item.routes.length>0?
                  item.routes.map(subItem=>{
                    return(
                      <Menu.Item onClick={this.selectedKeysChange} key={ subItem.path }>
                        <NavLink to={ subItem.path }> { subItem.name } </NavLink>
                      </Menu.Item>
                    )
                  })
                  :
                  ''
                }
                </SubMenu>
              )
            }
          })
          :
          ''
        }
        </Menu>
      </Scrollbars>
    );
  }
}


export default Navigation
