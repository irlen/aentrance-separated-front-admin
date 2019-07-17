/** @jsx jsx */
import React, { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { Breadcrumb,Icon } from 'antd'
import { withRouter } from 'react-router-dom'

import { SubRoute } from '../Routes'
import { routeOne } from '../Routes/routeConfig'
class Container extends Component {
  //面包屑导航
  getBreadcrumb = ()=>{
    const curPath = this.props.location.pathname
    const reg = /\/[a-z0-9]+/g
    const pathArray = curPath.match(reg)
    let breadDom = []
    if(pathArray && pathArray.length>0){
      routeOne.map(item=>{
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
  render(){
    return (
      <div>
        <div css={{lineHeight:"40px",paddingLeft:"20px",fontSize:"12px"}}>
          {
            //this.getBreadcrumb()
          }
        </div>
        <div css={{padding: "20px"}}>
          <SubRoute />
        </div>
      </div>
    )
  }
}

export default withRouter(Container)
