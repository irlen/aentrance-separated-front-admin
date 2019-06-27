/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React, { Component } from 'react'
import { Tabs } from 'antd'

import Configure from './Configure'
import Manage from './Manage'


const TabPane = Tabs.TabPane
class SystemRule extends Component{
  state = {
    activeKey: 'configure'
  }
  componentDidMount(){
    this._isMounted = true
  }
  callback = (value)=>{
    if(this._isMounted){
      this.setState({
        activeKey: value
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return(
      <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
        <TabPane tab="配置" key="configure">
          <Configure />
        </TabPane>
        <TabPane tab="管理" key="manage">
          <Manage />
        </TabPane>
      </Tabs>
    )
  }
}

export default SystemRule
