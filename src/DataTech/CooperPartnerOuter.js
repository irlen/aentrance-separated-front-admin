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
class CooperPartnerOuter extends Component{
  state = {
    cooper_outer_list:[
        {
          cooper_outer_name:"",
          cooper_outer_attr:[],
          cooper_outer_model:[],
          cooper_outer_reason:[],
          cooper_outer_note:"",
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      cooper_outer_name:"",
      cooper_outer_attr:[],
      cooper_outer_model:[],
      cooper_outer_renson:[],
      cooper_outer_note:"",
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      cooper_outer_list: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        cooper_outer_list: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_outer_list)
      cur.push({
        cooper_outer_name:"",
        cooper_outer_attr:[],
        cooper_outer_model:[],
        cooper_outer_renson:[],
        cooper_outer_note:"",
      })
      this.setState({
        cooper_outer_list: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_outer_list(this.state.cooper_outer_list)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_outer_list)
      cur.splice(index,1)
      this.setState({
        cooper_outer_list: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_outer_list(this.state.cooper_outer_list)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_outer_list)
      cur[index][field] = value
      this.setState({
        cooper_outer_list: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_outer_list(this.state.cooper_outer_list)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const agencyList = _.cloneDeep(this.state.cooper_outer_list)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16} style={{marginTop:"20px"}}>
          <Col style={{fontWeight:"bold"}}>国外合作对象</Col>
          {
            agencyList && agencyList.length>0?
            agencyList.map((item,index)=>{
              return (
                <Col key={index}>
                  <Row gutter={16} style={{marginTop:"20px"}}>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>名称</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.cooper_outer_list[index]['cooper_outer_name']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_outer_name')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>属性</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={2}
                            maxTagPlaceholder="...等"
                            value={this.state.cooper_outer_list[index]['cooper_outer_attr']}
                            onChange={(value)=>{this.inputChange(value,index,'cooper_outer_attr')}}
                          >
                            <Option value="大科学装置" key="大科学装置">大科学装置</Option>
                            <Option value="国家实验室" key="国家实验室">国家实验室</Option>
                            <Option value="研究所" key="研究所">研究所</Option>
                            <Option value="研究中心" key="研究中心">研究中心</Option>
                            <Option value="孵化器" key="孵化器">孵化器</Option>
                            <Option value="企业" key="企业">企业</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>模式</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={2}
                            maxTagPlaceholder="...等"
                            value={this.state.cooper_outer_list[index]['cooper_outer_model']}
                            onChange={(value)=>{this.inputChange(value,index,'cooper_outer_model')}}
                          >
                            <Option value="共建国家大学科技园模式" key="共建国家大学科技园模式">共建国家大学科技园模式</Option>
                            <Option value="技术开发、技术转让、技术咨询、技术服务模式" key="技术开发、技术转让、技术咨询、技术服务模式">技术开发、技术转让、技术咨询、技术服务模式</Option>
                            <Option value="共同承担国家科技计划重大课题模式" key="共同承担国家科技计划重大课题模式">共同承担国家科技计划重大课题模式</Option>
                            <Option value="共建研发机构模式" key="共建研发机构模式">共建研发机构模式</Option>
                            <Option value="共同培养高层次人才模式" key="共同培养高层次人才模式">共同培养高层次人才模式</Option>
                            <Option value="教学—科研—生产联合体模式" key="教学—科研—生产联合体模式">教学—科研—生产联合体模式</Option>
                            <Option value="其他" key="其他">其他</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>原因</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={2}
                            maxTagPlaceholder="...等"
                            value={this.state.cooper_outer_list[index]['cooper_outer_reason']}
                            onChange={(value)=>{this.inputChange(value,index,'cooper_outer_reason')}}
                          >
                            <Option value="科研技术驱动" key="科研技术驱动">科研技术驱动</Option>
                            <Option value="共享设备驱动" key="共享设备驱动">共享设备驱动</Option>
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
                        <div style={{...c1}}>内容</div>
                        <div style={{...c2}}>
                          <TextArea autosize={{minRows:1, maxRows:2}}
                            value={this.state.cooper_outer_list[index]['cooper_outer_note']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_outer_note')}}
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


export default CooperPartnerOuter
