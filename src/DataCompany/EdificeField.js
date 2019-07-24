/** @jsx jsx */
import React, { Component } from 'react'
import { Row, Col, Button, Form, Input, Icon, Select, InputNumber } from 'antd'
import _ from 'lodash'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'

const { Option } = Select
const c0 = {display:"flex"}
const c1 = {
  flex:"0 0 160px",lineHeight:"32px"
}
const c2 = {flex:"1 1 auto"}
class EdificeField extends Component{

  state = {
    edifice_field:[
        {
          edifice_height:"",
          edifice_floor_height:"",
          edifice_area:"",
          edifice_func:[]
      }
    ]
  }
  componentDidMount(){
    this._isMounted = true
    let init = [{
      edifice_height:"",
      edifice_floor_height:"",
      edifice_area:"",
      edifice_func:[]
    }]

    if(this.props.data && this.props.data.length>0){
      init = _.cloneDeep(this.props.data)
    }
    this.setState({
      edifice_field: init
    })
  }
  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props.data,nextProps.data)){
      this.setState({
        edifice_field: _.cloneDeep(nextProps.data)?_.cloneDeep(nextProps.data):[]
      })
    }
  }
  add = ()=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.edifice_field)
      cur.push({
        edifice_height:"",
        edifice_floor_height:"",
        edifice_area:"",
        edifice_func:[]
      })
      this.setState({
        edifice_field: _.cloneDeep(cur)
      },()=>{
        this.props.setEdifice_field(this.state.edifice_field)
      })
    }
  }
  remove = (index)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.edifice_field)
      cur.splice(index,1)
      this.setState({
        edifice_field: _.cloneDeep(cur)
      },()=>{
        this.props.setEdifice_field(this.state.edifice_field)
      })
    }
  }
  inputChange = (value,index,field)=>{
    if(this._isMounted){
      let cur = _.cloneDeep(this.state.edifice_field)
      cur[index][field] = value
      this.setState({
        edifice_field: _.cloneDeep(cur)
      },()=>{
        this.props.setEdifice_field(this.state.edifice_field)
      })
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }
  render(){
    const EdificeField = _.cloneDeep(this.state.edifice_field)
    return (
      <div style={{padding: "0  20px 0 20px"}}>
        <Row gutter={16}>
        {
          //<Col style={{fontWeight:"bold"}} ></Col>
        }
          {
            EdificeField && EdificeField.length>0?
            EdificeField.map((item,index)=>{
              return (
                <Col key={index}>
                  <Row gutter={16} style={{marginTop:"20px",lineHeight:"32px"}}>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>独立占地的建筑高度</div>
                        <div style={{...c2}}>
                          <InputNumber
                            value={this.state.edifice_field[index]['edifice_height']}
                            onChange={(value)=>{this.inputChange(value,index,'edifice_height')}}
                            style={{width:"100%"}}
                          />
                        </div>
                        <div style={{flex:"0 0 40px"}}>层</div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>独立占地的建筑首层层高</div>
                        <div style={{...c2}}>
                          <InputNumber
                            value={this.state.edifice_field[index]['edifice_floor_height']}
                            onChange={(value)=>{this.inputChange(value,index,'edifice_floor_height')}}
                            style={{width:"100%"}}
                          />
                        </div>
                        <div style={{flex:"0 0 40px"}}>m</div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>独立占地的建筑面积</div>
                        <div style={{...c2}}>
                          <InputNumber
                            value={this.state.edifice_field[index]['edifice_area']}
                            onChange={(value)=>{this.inputChange(value,index,'edifice_area')}}
                            style={{width:"100%"}}
                          />
                        </div>
                        <div style={{flex:"0 0 40px"}}>m²</div>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={12} style={{margin: "10px 0 10px 0"}}>
                      <div style={{...c0}}>
                        <div style={{...c1}}>独立占地的建筑物业功能</div>
                        <div style={{...c2}}>
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            maxTagCount={1}
                            maxTagPlaceholder="...等"
                            value={this.state.edifice_field[index]['edifice_func']}
                            onChange={(value)=>{this.inputChange(value,index,'edifice_func')}}
                          >
                            <Option value="研发" key="研发">研发</Option>
                            <Option value="生产" key="生产">生产</Option>
                            <Option value="办公" key="办公">办公</Option>
                            <Option value="检测试验" key="检测试验">检测试验</Option>
                            <Option value="其他" key="其他">其他</Option>
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


export default EdificeField
