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
class CooperShenha extends Component{
  state = {
    cooper_shenha:[
        {
          cooper_detail:"",
          cooper_person:"",
          cooper_contact:"",
          cooper_reason:"",
          cooper_content:"",
          cooper_note:""
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      cooper_detail:"",
      cooper_person:"",
      cooper_contact:"",
      cooper_reason:"",
      cooper_content:"",
      cooper_note:""
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      cooper_shenha: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        cooper_shenha: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_shenha)
      cur.push({
        cooper_detail:"",
        cooper_person:"",
        cooper_contact:"",
        cooper_reason:"",
        cooper_content:"",
        cooper_note:""
      })
      this.setState({
        cooper_shenha: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_shenha(this.state.cooper_shenha)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_shenha)
      cur.splice(index,1)
      this.setState({
        cooper_shenha: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_shenha(this.state.cooper_shenha)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.cooper_shenha)
      cur[index][field] = value
      this.setState({
        cooper_shenha: _.cloneDeep(cur)
      },()=>{
        this.props.setCooper_shenha(this.state.cooper_shenha)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const agencyList = _.cloneDeep(this.state.cooper_shenha)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16} style={{marginTop:"20px"}}>
          <Col style={{fontWeight:"bold"}}>哈尔滨/深圳合作</Col>
          {
            agencyList && agencyList.length>0?
            agencyList.map((item,index)=>{
              return (
                <Col key={index}>
                  <Row gutter={16} style={{marginTop:"20px"}}>
                    <Col sm={12} md={8} lg={8} style={{height:"32px",margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>合作情况</div>
                        <div style={{...c2}}>
                          <TextArea autosize={{minRows:1, maxRows:2}}
                            value={this.state.cooper_shenha[index]['cooper_detail']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_detail')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>联系人</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.cooper_shenha[index]['cooper_person']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_person')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>联系人</div>
                        <div style={{...c2}}>
                          <Input
                            value={this.state.cooper_shenha[index]['cooper_contact']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_contact')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{height:"32px",margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>合作原因</div>
                        <div style={{...c2}}>
                          <TextArea autosize={{minRows:1, maxRows:2}}
                            value={this.state.cooper_shenha[index]['cooper_reason']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_reason')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{height:"32px",margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>合作内容</div>
                        <div style={{...c2}}>
                          <TextArea autosize={{minRows:1, maxRows:2}}
                            value={this.state.cooper_shenha[index]['cooper_content']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_content')}}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={8} lg={8} style={{height:"32px",margin:"10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>情况备注</div>
                        <div style={{...c2}}>
                          <TextArea autosize={{minRows:1, maxRows:2}}
                            value={this.state.cooper_shenha[index]['cooper_note']}
                            onChange={(e)=>{this.inputChange(e.target.value,index,'cooper_note')}}
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


export default CooperShenha
