/** @jsx jsx */
import React, { Component } from 'react'
import { Tabs, Row, Col, Button } from 'antd'
import { jsx, css } from '@emotion/core'




import AutoSet from './AutoSet'
import HandleSelf from './HandleSelf'
const TabPane =  Tabs.TabPane

class SystemBase extends Component {

  render(){
    return(
      <div>
        <Row>
          <Col>
            <AutoSet />
          </Col>
        </Row>
      </div>
    )
  }
}


export default SystemBase
