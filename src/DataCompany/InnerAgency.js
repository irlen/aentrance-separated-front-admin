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
class InnerAgency extends Component{

  state = {
    inner_agency:[
        {
          agency_name:"",
          agency_address:"",
          agency_func:[],
          agency_note:"",
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      agency_name:"",
      agency_address:"",
      agency_func:[],
      agency_note:"",
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      inner_agency: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        inner_agency: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.inner_agency)
      cur.push({
        agency_name:"",
        agency_address:"",
        agency_func:[],
        agency_note:"",
      })
      this.setState({
        inner_agency: _.cloneDeep(cur)
      },()=>{
        this.props.setInner_agency(this.state.inner_agency)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.inner_agency)
      cur.splice(index,1)
      this.setState({
        inner_agency: _.cloneDeep(cur)
      },()=>{
        this.props.setInner_agency(this.state.inner_agency)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.inner_agency)
      cur[index][field] = value
      this.setState({
        inner_agency: _.cloneDeep(cur)
      },()=>{
        this.props.setInner_agency(this.state.inner_agency)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const agencyList = _.cloneDeep(this.state.inner_agency)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16} style={{marginTop:"20px"}}>
          <Col style={{fontWeight:"bold"}}>国内分支机构</Col>
          {
            agencyList && agencyList.length>0?
            agencyList.map((item,index)=>{
              return (
                <Col key={index}>
                  <Row gutter={16} style={{marginTop:"20px"}}>
                    <Col sm={12} md={6} lg={6} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>机构名称</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.inner_agency[index]['agency_name']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'agency_name')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6} lg={6} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>机构地址</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.inner_agency[index]['agency_address']}
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
                              value={this.state.inner_agency[index]['agency_func']}
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
                          <TextArea autosize={{minRows:1, maxRows:2}}
                            value={this.state.inner_agency[index]['agency_note']}
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


export default InnerAgency
