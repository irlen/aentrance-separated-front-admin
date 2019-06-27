/** @jsx jsx */
import React ,{ Component } from 'react'
import { jsx, css } from '@emotion/core'
import { Row, Col, Select } from 'antd'
import _ from 'lodash'

import { wyAxiosPost } from '../components/WyAxios'
import WyDatePicker from '../components/WyDatePicker'
import { Amodule } from '../components/Amodule'
import TemplateForLine from './TemplateForLine'
import TemplateForColumn from './TemplateForColumn'
import TemplateForTable from './TemplateForTable'
const {Option} = Select

class DashboardBuiltin extends Component{
  state = {
    allTime: [],
    appList: [],
    appname: '',
  }
  componentDidMount(){
    this._isMounted = true
    this.getApp()
  }
  getApp = ()=>{
    wyAxiosPost('App/getAppList',{},(result)=>{
      const responseData = result.data.msg
      const allTime = []
      allTime.push(responseData.start_time)
      allTime.push(responseData.last_time)
      if(this._isMounted){
        this.setState({
          appList: _.cloneDeep(responseData.applist),
          allTime
        })
      }
    })
  }
  allTimeChange = (value)=>{
    if(this._isMounted){
      this.setState({
        allTime: value
      })
    }
  }
  appnameChange = (value)=>{
    if(this._isMounted){
      this.setState({
        appname: value
      })
    }
  }
  componentWilUnmount(){
    this._isMounted = false
  }
  render(){
    return (
      <div>
        <Row>
          <Col>
            <span>
              应用：
              <Select size="small"
                css={{minWidth:"120px"}}
                onChange={this.appnameChange}
                value={this.state.appname}
              >
                {
                  this.state.appList && this.state.appList.length>0?
                  this.state.appList.map(item=>{
                    return <Option key={item.value} value={item.value} title={item.value}>{item.name}</Option>
                  })
                  :
                  ''
                }
              </Select>
            </span>
            <span css={{float:"right"}}>
              <WyDatePicker curTime={this.state.allTime} rangeTimeChange={this.allTimeChange}/>
            </span>
          </Col>
        </Row>
        <Row gutter={16} css={{marginTop: "20px"}}>
          <Col span={12}>
            <Amodule>
              <TemplateForLine
                appname={this.state.appname}
                field="request"
                type={['server','custom']}
                tabs={['服务端','客户端']}
                allTime={this.state.allTime}
              />
            </Amodule>
          </Col>
          <Col span={12}>
            <Amodule>
              <TemplateForLine
                appname={this.state.appname}
                field="code"
                type={['code']}
                tabs={['http状态码']}
                allTime={this.state.allTime}
              />
            </Amodule>
          </Col>
        </Row>
        <Row gutter={16} css={{marginTop: "20px"}}>
          <Col span={12}>
            <Amodule>
              <TemplateForLine
                appname={this.state.appname}
                field="count"
                type={['method','browser']}
                tabs={['http方法','客户端浏览器']}
                allTime={this.state.allTime}
              />
            </Amodule>
          </Col>
          <Col span={12}>
            <Amodule>
              <TemplateForColumn
                appname={this.state.appname}
                field="count"
                type={['url']}
                tabs={['URL']}
                allTime={this.state.allTime}
              />
            </Amodule>
          </Col>
        </Row>
        <Row gutter={16} css={{marginTop: "20px"}}>
          <Col span={12}>
            <Amodule>
              <TemplateForTable
                appname={this.state.appname}
                field="count"
                type={'url_bytes'}
                tab={'请求流量最大'}
                allTime={this.state.allTime}
              />
            </Amodule>
          </Col>
          <Col span={12}>
            <Amodule>
              <TemplateForTable
                appname={this.state.appname}
                field="count"
                type={'url_count'}
                tab={'请求数最多'}
                allTime={this.state.allTime}
              />
            </Amodule>
          </Col>
        </Row>
        <Row gutter={16} css={{marginTop: "20px"}}>
          <Col>
            <Amodule>
              <TemplateForTable
                appname={this.state.appname}
                field="count"
                type={'url_error'}
                tab={'请求错误'}
                allTime={this.state.allTime}
              />
            </Amodule>
          </Col>
        </Row>
      </div>
    )
  }
}

export default DashboardBuiltin
