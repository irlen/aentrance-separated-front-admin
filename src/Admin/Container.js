/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { Breadcrumb,Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import $ from 'jquery'

import SideNav from './SideNav'
import { SubAdminRoute } from '../Routes'
import { adminRoute } from '../Routes/routeConfig'
import { setWindowH } from '../actions'
class Container extends Component {
  state = {
    leftW: "60"
  }
  componentDidMount(){
    this._isMounted = true
    const rightContainer = document.querySelector(".rightContainer")
    const leftNav = document.querySelector(".leftNav")

    const windowH = parseInt(document.body.clientHeight,0)
    rightContainer.style.height = windowH +'px'
    leftNav.style.height = windowH-40 +'px'
    this.props.setWindowH(windowH)
    window.onresize = ()=>{
      const rwindowH = parseInt(document.body.clientHeight,0)
      this.props.setWindowH(rwindowH)
      rightContainer.style.height = rwindowH +'px'
      leftNav.style.height = rwindowH-40 +'px'
    }
  }
  //面包屑导航
  getBreadcrumb = ()=>{
    const curPath = this.props.location.pathname
    const reg = /\/[a-z0-9]+/g
    const pathArray = curPath.match(reg)
    let breadDom = []
    if(pathArray && pathArray.length>0){
      adminRoute.map(item=>{
        if(item.path === pathArray[0]){
          breadDom.push(
            <Breadcrumb.Item key={item.key} href={item.path}>
                <span title={item.name} className={item.icon}></span>
            </Breadcrumb.Item>
          )
        }
        if(item.path === (pathArray[0]+pathArray[1])){
          breadDom.push(
            <Breadcrumb.Item key={item.key} href="">
                <i title={item.name} className={item.icon}></i>
            </Breadcrumb.Item>
          )

          // item.routes.map(subItem=>{
          //   if(subItem.path === (pathArray[0]+pathArray[1]+pathArray[2]) || pathArray.length>3){
          //     breadDom.push(
          //       <Breadcrumb.Item key={subItem.key} href={subItem.path}>
          //         <span>{subItem.name}</span>
          //       </Breadcrumb.Item>
          //     )
          //   }
          // })
          for(let subItem of item.routes){
            if(subItem.path === (pathArray[0]+pathArray[1]+pathArray[2]) || pathArray.length>3){
              breadDom.push(
                <Breadcrumb.Item key={subItem.key} href={subItem.path}>
                  <span>{subItem.name}</span>
                </Breadcrumb.Item>
              )
              break
            }
          }
        }
      })
    }
    let lastBread = <Breadcrumb  key='mykey' separator="|">
      {breadDom}
    </Breadcrumb>
    return lastBread
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  setLeftW = (value)=>{
    if(this._isMounted){
      this.setState({
        leftW:value
      })
    }
  }
  render(){
    return (
      <div style={{display:"flex"}}>
        <div style={{flex:`0 0 ${this.state.leftW}px`,background:"rgba(0,0,0,0.1)"}}>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            className='leftNav'
            >
              <SideNav setLeftW={this.setLeftW}/>
          </Scrollbars>
        </div>
        <div style={{flex:"1 1 auto"}}>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            className='rightContainer'
            >
              <div css={{lineHeight:"40px",paddingLeft:"20px",fontSize:"12px"}}>
                {
                  //this.getBreadcrumb()
                }
              </div>
              <div css={{padding: "20px 20px 40px 20px"}}>
                <SubAdminRoute />
              </div>
          </Scrollbars>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH
})
const mapDispatchToProps = (dispatch)=>({
  setWindowH: (windowH)=>{dispatch(setWindowH(windowH))}
})
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Container))
