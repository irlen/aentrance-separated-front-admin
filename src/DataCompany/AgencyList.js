/** @jsx jsx */
import React, { Component } from 'react'
import { Row, Col, Button, Form, Input, Icon, Select } from 'antd'
import _ from 'lodash'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

const { Option } = Select
const c0 = {display:"flex"}
const c1 = {
  flex:"0 0 60px",lineHeight:"32px"
}
const c2 = {flex:"1 1 auto"}
class AgencyList extends Component{

  state = {
    agencys_shenha:[
        {
          agency_name:"",
          agency_person:"",
          agency_contact:"",
          agency_func:[]
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      agency_name:"",
      agency_person:"",
      agency_contact:"",
      agency_func:[]
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      agencys_shenha: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        agencys_shenha: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.agencys_shenha)
      cur.push({
        agency_name:"",
        agency_person:"",
        agency_contact:"",
        agency_func:[]
      })
      this.setState({
        agencys_shenha: _.cloneDeep(cur)
      },()=>{
        this.props.setAgencys_shenha(this.state.agencys_shenha)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.agencys_shenha)
      cur.splice(index,1)
      this.setState({
        agencys_shenha: _.cloneDeep(cur)
      },()=>{
        this.props.setAgencys_shenha(this.state.agencys_shenha)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.agencys_shenha)
      cur[index][field] = value
      this.setState({
        agencys_shenha: _.cloneDeep(cur)
      },()=>{
        this.props.setAgencys_shenha(this.state.agencys_shenha)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const agencyList = _.cloneDeep(this.state.agencys_shenha)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16}>
          <Col style={{fontWeight:"bold"}} >深圳/哈尔滨分支机构</Col>
          {
            agencyList && agencyList.length>0?
            agencyList.map((item,index)=>{
              return (
                <Col key={index}>
                  <Row gutter={16} style={{marginTop:"20px"}}>
                    <Col sm={12} md={6} lg={6}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>公司全称</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.agencys_shenha[index]['agency_name']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'agency_name')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>联系人</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.agencys_shenha[index]['agency_person']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'agency_person')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>联系方式</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.agencys_shenha[index]['agency_contact']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'agency_contact')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>承担职能</div>
                        <div style={{...c2}}>
                          <Select
                              mode="multiple"
                              style={{ width: '100%' }}
                              maxTagCount={1}
                              maxTagPlaceholder="...等"
                              value={this.state.agencys_shenha[index]['agency_func']}
                              onChange={(value)=>{this.inputChange(value,index,'agency_func')}}
                            >
                              <Option value="生产" key="生产">生产</Option>
                              <Option value="研发" key="研发">研发</Option>
                              <Option value="服务" key="服务">服务</Option>
                              <Option value="市场" key="市场">市场</Option>
                            </Select>
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


export default AgencyList
