/** @jsx jsx */
import React ,{ Component } from 'react'
import { jsx, css } from '@emotion/core'
import { Tabs } from 'antd'
import _ from 'lodash'

import Line from '../components/Line'
import WyDatePicker from '../components/WyDatePicker'
import {wyAxiosPost} from '../components/WyAxios'
import WySpin from '../components/WySpin'
const { TabPane } = Tabs
class TemplateForLine extends Component{
  state = {
    xData: [],
    yData: [],
    curTime: [],
    type: 'server',
    appname: '',
    field:'',
    xData:[],
    yData:[],
    aUnit:'',
    isSpaning: false
  }
  componentDidMount(){
    this._isMounted = true
    const { appname, field, type } = this.props

    if(this._isMounted){
      this.setState({
        type: type[0],
        appname,
        field
      })
    }
  }
  componentWillReceiveProps(nextProps){
    const { allTime, appname } = this.props
    if(
      (appname !== nextProps.appname) ||
      (! _.isEqual(allTime, nextProps.allTime))
    ){
      if(this._isMounted && (! _.isEqual(allTime, nextProps.allTime)) ){
        this.setState({
          curTime: _.cloneDeep(nextProps.allTime),
          appname: nextProps.appname
        },()=>{
          this.getData()
        })
      }else if(appname !== nextProps.appname){
        this.setState({
          appname: nextProps.appname
        },()=>{
          this.getData()
        })
      }
    }
  }
  getData = ()=>{
    let info = {}
    const { type, field, appname }  =  this.state
    info = {type,field,appname}
    if(this.state.curTime && this.state.curTime.length>0){
      info.start_time = this.state.curTime[0]
      info.last_time = this.state.curTime[1]
    }
    wyAxiosPost('App/getAppData',{info},(result)=>{
      const responseData = result.data.msg
      if(this._isMounted){
        this.setState({
          xData: _.cloneDeep(responseData.xxx),
          yData: _.cloneDeep(responseData.yyy),
          aUnit: responseData.unit
        })
      }
    })
  }
  curTimeChange = (value)=>{
    if(this._isMounted){
      this.setState({
        curTime: value
      },()=>{
        this.getData()
      })
    }
  }
  typeChange = (value)=>{
    if(this._isMounted){
      this.setState({
        type: value
      },()=>{
        this.getData()
      })
    }
  }

  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return <Tabs tabBarExtraContent={
      <WyDatePicker
        curTime={this.state.curTime}
        rangeTimeChange={this.curTimeChange}
      />
    }
    onChange={this.typeChange}
    >
      <TabPane tab={this.props.tabs[0]} key={this.props.type[0]}>
        <WySpin isSpining={this.state.isSpaning}>
          <Line
            xData={this.state.xData.length>0?this.state.xData:[]}
            yData={this.state.yData.length>0?this.state.yData:[]}
            aUnit={this.state.aUnit}
          />
        </WySpin>
      </TabPane>
      {
        this.props.type.length>1?
        <TabPane tab={this.props.tabs[1]} key={this.props.type[1]}>
          <WySpin isSpining={this.state.isSpaning}>
            <Line
              xData={this.state.xData.length>0?this.state.xData:[]}
              yData={this.state.yData.length>0?this.state.yData:[]}
              aUnit={this.state.aUnit}
            />
          </WySpin>
        </TabPane>
        :
        ''
      }

    </Tabs>

  }
}

export default TemplateForLine
