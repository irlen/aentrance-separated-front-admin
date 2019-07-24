/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Row, Col, Input, AutoComplete, Icon, Select, message } from 'antd'
import _ from 'lodash'

import { wyAxiosPost } from '../components/WyAxios'
import ModuleList from './ModuleList'
import ShowDetail from './ShowDetail'
const { Option } = Select
class SearchFor extends Component{
  state = {
    searchValue: '',
    filteredData: [],
    park_list:[],
    build_list: [],
    enterprise_list:[],
    park:'',
    build:'',
    enterprise:'',
    detail:{}
  }
  componentDidMount(){
    this._isMounted = true
    this.getAllList()
  }
  //获取搜索下拉列表
  getAllList = ()=>{
    wyAxiosPost('Search/getNameList',{},(result)=>{
      const responseData = _.cloneDeep(result.data.msg)
      if(this._isMounted){
        this.setState({
          filteredData: responseData.msg
        })
      }
    })
  }
  handleChange = (value)=>{
    if(this._isMounted){
      this.setState({
        searchValue: value
      },()=>{
        this.doSearch()
      })
    }
  }
  doSearch = ()=>{
    const info = JSON.parse(_.cloneDeep(this.state.searchValue))
    if(!info){
      message.warning('请从下拉框中选择搜索对象')
      return
    }
    wyAxiosPost('Search/getSearchData',{info},(result)=>{
      const responseData = result.data.msg
      const {
        park_list, build_list, enterprise_list,
        park,build,enterprise
      } = responseData.msg
      if(this._isMounted){
        this.setState({
          park_list: park_list?_.cloneDeep(park_list):[],
          build_list: build_list?_.cloneDeep(build_list):[],
          enterprise_list: enterprise_list?_.cloneDeep(enterprise_list):[],
          park: park?park:'',
          build: build?build:'',
          enterprise: enterprise?enterprise:''
        })
      }
    })
  }
  setTypeField = (type,id)=>{
    if(this._isMounted){
      this.setState({
        [type]: id
      })
    }
  }
  setFieldList = (type,list)=>{
    if(this._isMounted){
      if(type === 'park'){
        this.setState({
          build_list:  list,
          enterprise_list:[]
        })
      }else if(type === 'build'){
        this.setState({
          enterprise_list:  list
        })
      }
    }
  }
  setDetail = (type,name,data)=>{
    let info = {}
    info = {type,name,data}
    if(this._isMounted){
      this.setState({
        detail: info
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return (
      <div>
        <Row>
          <Col sm={20} md={8} lg={6}>
            <div style={{position:"relative"}}>
              <Select
                showSearch
                value={this.state.searchValue}
                defaultActiveFirstOption={false}
                showArrow={false}
                onChange={this.handleChange}
                notFoundContent={'未匹配到任何对象'}
                style={{width:"100%"}}
                suffixIcon={<Icon type="search" />}
                optionLabelProp="title"
                optionFilterProp="title"
              >
                {
                  this.state.filteredData && this.state.filteredData.length>0?
                  this.state.filteredData.map(item=>{
                    const selType = (item)=>{
                      let type = ''
                      if(item === 'park'){
                        type = '产业园'
                      }else if(item === 'build'){
                        type = '楼宇'
                      }else if(item === 'enterprise'){
                        type = '企业'
                      }
                      return type
                    }
                    return <Option key={item.name} title={item.name} value={`{"id":"${item.id}","type":"${item.type}"}`}>{item.name} <span style={{float:"right",fontSize:"12px"}}>{selType(item.type)}</span></Option>
                  })
                  :
                  ''
                }
              </Select>
              <span
                style={{position:"absolute",top: "5px", right:"10px", color:"rgba(0,0,0,0.2)",cursor:"pointer"}}
                onClick={this.doSearch}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </span>
            </div>
          </Col>
          <Col sm={4} md={16} lg={18}></Col>
        </Row>
        <Row gutter={16} style={{marginTop:"20px"}}>
          <Col>
            <div css={{display:"flex"}}>
              <div css={{flex:"0 0 300px",padding:" 0 10px 0 10px"}}>
                <ModuleList
                  setTypeField={this.setTypeField}
                  setFieldList={this.setFieldList}
                  setDetail={this.setDetail}
                  type="park"
                  list={this.state.park_list}
                  curTarget={this.state.park}
                />
              </div>
              <div css={{flex:"0 0 300px",padding:" 0 10px 0 10px"}}>
                <ModuleList
                  setFieldList={this.setFieldList}
                  setTypeField={this.setTypeField}
                  setDetail={this.setDetail}
                  type="build"
                  list={this.state.build_list}
                  curTarget={this.state.build}
                />
              </div>
              <div css={{flex:"0 0 300px",padding:" 0 10px 0 10px"}}>
              <ModuleList
                setFieldList={this.setFieldList}
                setTypeField={this.setTypeField}
                setDetail={this.setDetail}
                type="enterprise"
                list={this.state.enterprise_list}
                curTarget={this.state.enterprise}
              />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <ShowDetail detail={this.state.detail}/>
        </Row>
      </div>
    )
  }
}


export default SearchFor
