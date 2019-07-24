/** @jsx jsx */
import React, { Component } from 'react'
import { Row, Col, Button, Form, Input, Icon, Select } from 'antd'
import _ from 'lodash'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

const { TextArea } = Input
const { Option } = Select
const c0 = {display:"flex"}
const c1 = {
  flex:"0 0 60px",lineHeight:"32px"
}
const c2 = {flex:"1 1 auto"}
class AbroadInvestment extends Component{
  state = {
    abroad_investment:[
        {
          agency_name:"",
          agency_address:"",
          agency_note:"",
          agency_func:[]
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      agency_name:"",
      agency_address:"",
      agency_note:"",
      agency_func:[]
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      abroad_investment: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        abroad_investment: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.abroad_investment)
      cur.push({
        agency_name:"",
        agency_address:"",
        agency_note:"",
        agency_func:[]
      })
      this.setState({
        abroad_investment: _.cloneDeep(cur)
      },()=>{
        this.props.setAbroad_investment(this.state.abroad_investment)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.abroad_investment)
      cur.splice(index,1)
      this.setState({
        abroad_investment: _.cloneDeep(cur)
      },()=>{
        this.props.setAbroad_investment(this.state.abroad_investment)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.abroad_investment)
      cur[index][field] = value
      this.setState({
        abroad_investment: _.cloneDeep(cur)
      },()=>{
        this.props.setAbroad_investment(this.state.abroad_investment)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const AbroadInvestment = _.cloneDeep(this.state.abroad_investment)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16} style={{marginTop:"20px"}}>
          <Col style={{fontWeight:"bold"}} >对外投资</Col>
          {
            AbroadInvestment && AbroadInvestment.length>0?
            AbroadInvestment.map((item,index)=>{
              return (
                <Col key={index} style={{marginTop:"20px"}}>
                  <Row gutter={16}>
                    <Col sm={12} md={6} lg={6} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>名称</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.abroad_investment[index]['agency_name']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'agency_name')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6} lg={6} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>所在地</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.abroad_investment[index]['agency_address']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'agency_address')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6} lg={6} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>承担职能</div>
                        <div style={{...c2}}>
                          <Select
                              mode="multiple"
                              style={{ width: '100%' }}
                              maxTagCount={1}
                              maxTagPlaceholder="...等"
                              value={this.state.abroad_investment[index]['agency_func']}
                              onChange={(value)=>{this.inputChange(value,index,'agency_func')}}
                            >
                              <Option value="生产" key="生产">生产</Option>
                              <Option value="研发" key="研发">研发</Option>
                              <Option value="服务" key="服务">服务</Option>
                              <Option value="市场" key="市场">市场</Option>
                            </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6} lg={6} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>备注</div>
                        <div style={{...c2}}>

                            <TextArea
                              autosize={{minRows:1, maxRows:2}}
                              value={this.state.abroad_investment[index]['agency_note']}
                              onChange={(e)=>{this.inputChange(e.target.value,index,'agency_note')}}
                            />
                        </div>
                        <div style={{flex:"0 0  30px",textAlign: "right"}}>
                          {
                            index === 0?
                            ''
                            :
                            <span title={'删除'} onClick={()=>{this.remove(index)}} css={{
                              fontSize:"22px",
                              lineHeight:"32px",
                              cursor:"pointer",
                              "&:hover":{color:"#01bd4c"}
                            }}><i className="fa fa-minus-square-o" aria-hidden="true"></i></span>
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              )
            })
            :
            ''
          }
          <Col style={{marginTop:"20px"}}>
            <Button type="dashed" onClick={this.add} style={{ width: '20%' }}>
              <Icon type="plus" /> 添加
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}


export default AbroadInvestment
