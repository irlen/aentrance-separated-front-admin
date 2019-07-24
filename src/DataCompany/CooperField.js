/** @jsx jsx */
import React, { Component } from 'react'
import { Row, Col, Button, Form, Input, Icon, Select, InputNumber } from 'antd'
import _ from 'lodash'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

const { Option } = Select
const c0 = {display:"flex"}
const c1 = {
  flex:"0 0 80px",lineHeight:"32px"
}
const c2 = {flex:"1 1 auto"}
class CooperField extends Component{

  state = {
    cooper_field:[
        {
          cooper_obj:"",
          cooper_name:"",
          cooper_model:[],
          cooper_reason:[],
          cooper_fund:"",
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      cooper_obj:"",
      cooper_name:"",
      cooper_model:[],
      cooper_reason:[],
      cooper_fund:"",
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      cooper_field: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        cooper_field: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_field)
      cur.push({
        cooper_obj:"",
        cooper_name:"",
        cooper_model:[],
        cooper_reason:[],
        cooper_fund:"",
      })
      this.setState({
        cooper_field: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_field(this.state.cooper_field)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_field)
      cur.splice(index,1)
      this.setState({
        cooper_field: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_field(this.state.cooper_field)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_field)
      cur[index][field] = value
      this.setState({
        cooper_field: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_field(this.state.cooper_field)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const CooperField = _.cloneDeep(this.state.cooper_field)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16}>
        {
          //<Col style={{fontWeight:"bold"}} ></Col>
        }
          {
            CooperField && CooperField.length>0?
            CooperField.map((item,index)=>{
              return (
                <Col key={index}>
                  <Row gutter={16} style={{marginTop:"20px"}}>
                    <Col sm={12} md={8} lg={8} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>合作对象</div>
                        <div style={{...c2}}>
                          <Select style={{ width: "100%" }}
                            value={this.state.cooper_field[index]['cooper_obj']}
                            onChange={(value)=>{this.inputChange(value,index,'cooper_obj')}}
                          >
                            <Option value="军工" key="军工">军工</Option>
                            <Option value="院校" key="院校">院校</Option>
                            <Option value="科研机构" key="科研机构">科研机构</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>对象名称</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.cooper_field[index]['cooper_name']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_name')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>合作模式</div>
                        <div style={{...c2}}>
                          <Select
                              mode="multiple"
                              style={{ width: '100%' }}
                              maxTagCount={1}
                              maxTagPlaceholder="...等"
                              value={this.state.cooper_field[index]['cooper_model']}
                              onChange={(value)=>{this.inputChange(value,index,'cooper_model')}}
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
                    <Col sm={12} md={8} lg={8} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>合作原因</div>
                        <div style={{...c2}}>
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.cooper_field[index]['cooper_reason']}
                            onChange={(value)=>{this.inputChange(value,index,'cooper_reason')}}
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
                            <Option value="上下游企业配置" key="上下游企业配置">上下游企业配置</Option>
                            <Option value="形象驱动" key="形象驱动">形象驱动</Option>
                            <Option value="其他" key="其他">其他</Option>
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>资金规模(元)</div>
                        <div style={{...c2}}>
                          <InputNumber
                            value={this.state.cooper_field[index]['cooper_fund']}
                            onChange={(value)=>{this.inputChange(value,index,'cooper_fund')}}
                            style={{width:"100%"}}
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


export default CooperField
