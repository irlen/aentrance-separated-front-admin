import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'
import { Row, Col } from 'antd'

class ShowDetail extends Component {

  state = {
    data: {}
  }
  componentDidMount(){
    this._isMounted = true
    if(this._isMounted){
      this.setState({
        data: _.cloneDeep(this.props.detail)
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(!_.isEqual(this.props.detail,nextProps.detail)){
      if(this._isMounted){
        this.setState({
          data: _.cloneDeep(nextProps.detail)
        })
      }
    }
  }
  getType = (str)=>{
    if(str === 'park'){
      return '产业园'
    }else if(str === 'build'){
      return '楼宇'
    }else if(str==='enterprise'){
      return '企业'
    }else{
      return ''
    }
  }
  showIn = (data)=>{
    let dom = ''
    if(data.type === 'park'){
      dom = <Row gutter={16}>
        <Col sm={12} md={8} lg={6}>
          名称：{data.data.park_name}
        </Col>
        <Col sm={12} md={8} lg={6}>
          类型：{this.getType(data.type)}
        </Col>
        <Col sm={12} md={8} lg={6}>
          开发时间： {data.data.development_time}
        </Col>
        <Col>
          地址： {`${data.data.traffic_location}  ${data.data.detailed_address}`}
        </Col>
      </Row>
    }else if(data.type === 'build'){
      dom = <Row gutter={16}>
        <Col sm={12} md={8} lg={6}>
          名称：{data.data.building_name}
        </Col>
        <Col sm={12} md={8} lg={6}>
          类型：{this.getType(data.type)}
        </Col>
        <Col sm={12} md={8} lg={6}>
          开发时间： {data.data.development_time}
        </Col>
        <Col>
          地址： {`${data.data.traffic}`}
        </Col>
      </Row>
    }else if(data.type === 'enterprise'){
      dom = <Row gutter={16}>
        <Col sm={12} md={8} lg={6}>
          名称：{data.data.enterprise_type}
        </Col>
        <Col sm={12} md={8} lg={6}>
          类型：{this.getType(data.type)}
        </Col>
        <Col sm={12} md={8} lg={6}>
          经营状态： {data.data.business_status}
        </Col>
      </Row>
    }
    return dom
  }

  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    console.log(this.state.data)
    return(
      <div style={{background:"#f9f9f9",marginTop:"20px",padding:"20px",lineHeight:"60px"}}>
        <Scrollbars
          autoHide
          autoHideTimeout={100}
          autoHideDuration={200}
          universal={true}
          style={{height:"200px"}}
        >
          <div>
            {this.showIn(this.state.data)}
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export default ShowDetail
