/** @jsx jsx */
import React, { Component } from 'react'
import { Row, Col, Input, Switch, Select } from 'antd'
import { jsx, css } from '@emotion/core'
import _ from 'lodash'

import { wyAxiosPost} from '../components/WyAxios'
const Option = Select.Option
class LogSet extends Component{
  state={
    data:{},
    ruleList:[]
  }
  componentDidMount(){
    wyAxiosPost('Rule/getRule',{},(result)=>{
      const responseData = result.data.msg
      this.setState({
        ruleList:[...responseData.yyy]
      })
    })
    this.setState({
      data: _.cloneDeep(this.props.data)
    })
  }
  componentWillReceiveProps(nextProps){
     const isEqual = _.isEqual(this.props.data,nextProps.data)
     if(! isEqual){
       this.setState({
         data: _.cloneDeep(nextProps.data)
       })
     }
  }

  dataChange = (e,id,arg)=>{
    this.props.updateLog(id,arg,e.target.value)
  }
  logChange = (id,arg,value)=>{
    this.props.updateLog(id,arg,value)
  }
  render(){
    return(
      <div>
        <Row css={{textAlign:"center",lineHeight:"40px"}}>
          <Col span={8} css={{background:"rgba(0,0,0,0.2)",padding:"0 20px 0 20px"}} >
            <Input value={this.state.data.logpath} onChange={(e)=>this.dataChange(e,this.state.data.id,'logpath')}/>
          </Col>
          <Col span={4} css={{background:"rgba(0,0,0,0.1)",padding:"0 20px 0 20px"}} >
            <Input value={this.state.data.logtag} onChange={(e)=>this.dataChange(e,this.state.data.id,'logtag')}/>
          </Col>

          <Col span={3} css={{background:"rgba(0,0,0,0.2)"}}>
            <Switch checkedChildren="是" checked={this.state.data.logisreread} onChange={(value)=>this.logChange(this.state.data.id,'logisreread',value)} unCheckedChildren="否" />
          </Col>
          <Col span={3} css={{background:"rgba(0,0,0,0.1)"}}>
            <Switch checkedChildren="是" checked={this.state.data.logissingle} onChange={(value)=>this.logChange(this.state.data.id,'logissingle',value)} unCheckedChildren="否" />
          </Col>
          <Col span={4} css={{background:"rgba(0,0,0,0.2)",padding:"0 10px 0 10px"}}>
            <Select
              mode="multiple"
              value={this.state.data.logrule}
              onChange={(value)=>this.logChange(this.state.data.id,'logrule',value)}
              style={{width:"100%"}}
            >
              {
                this.state.ruleList.map(item=>{
                  return (
                    <Option key={item.id} title={item.rulename} value={item.id}>{item.rulename}</Option>
                  )
                })
              }
            </Select>
          </Col>
          <Col span={2} css={{background:"rgba(0,0,0,0.1)",padding:"0 20px 0 20px"}} >
            <span onClick={()=>this.props.doDeleteLog(this.state.data.id)} css={{cursor:"pointer"}}><i className="fa fa-trash" aria-hidden="true"></i></span>
          </Col>
        </Row>
      </div>
    )
  }
}


export default LogSet
