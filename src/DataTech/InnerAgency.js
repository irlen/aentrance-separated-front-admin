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
  flex:"0 0 80px",lineHeight:"32px"
}
const c2 = {flex:"1 1 auto"}
class InnerAgency extends Component{

  state = {
    inner_agency:[
        {
          agency_name:"",
          agency_address:"",
          agency_link:[],
          agency_reson:[],
          agency_content:"",
          agency_note:"",
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      agency_name:"",
      agency_address:"",
      agency_link:[],
      agency_reson:[],
      agency_content:"",
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
        agency_link:[],
        agency_reson:[],
        agency_content:"",
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
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
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
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
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
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>机构环节</div>
                        <div style={{...c2}}>
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.inner_agency[index]['agency_link']}
                            onChange={(value)=>{this.inputChange(value,index,'agency_link')}}
                          >
                            <Option value="基础研究（高等院校、大科学装置、国家实验室、省级实验室）" key="基础研究（高等院校、大科学装置、国家实验室、省级实验室）">基础研究（高等院校、大科学装置、国家实验室、省级实验室）</Option>
                            <Option value="应用研究" key="应用研究">应用研究</Option>
                            <Option value="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）" key="成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）">成果转化（试验发展、设计与试制、推广示范与技术服务、小批量单件常规生产）</Option>
                            <Option value="产业化" key="产业化">产业化</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>设置原因</div>
                        <div style={{...c2}}>
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.inner_agency[index]['agency_reason']}
                            onChange={(value)=>{this.inputChange(value,index,'agency_reason')}}
                          >
                            <Option value="科研技术驱动" key="科研技术驱动">科研技术驱动</Option>
                            <Option value="原材料驱动" key="原材料驱动">原材料驱动</Option>
                            <Option value="成果转化驱动" key="成果转化驱动">成果转化驱动</Option>
                            <Option value="市场驱动" key="市场驱动">市场驱动</Option>
                            <Option value="成本驱动" key="成本驱动">成本驱动</Option>
                            <Option value="人才驱动" key="人才驱动">人才驱动</Option>
                            <Option value="资金及金融驱动" key="资金及金融驱动">资金及金融驱动</Option>
                            <Option value="营商环境驱动" key="营商环境驱动">营商环境驱动</Option>
                            <Option value="上下游企业配套" key="上下游企业配套">上下游企业配套</Option>
                            <Option value="形象驱动" key="形象驱动">形象驱动</Option>
                            <Option value="其他" key="其他">其他</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>内容和技术</div>
                        <div style={{...c2}}>
                          <TextArea autosize={{minRows:1, maxRows:2}}
                            value={this.state.inner_agency[index]['agency_content']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'agency_content')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
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
