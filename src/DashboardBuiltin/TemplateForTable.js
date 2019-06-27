/** @jsx jsx */
import React ,{ Component } from 'react'
import { jsx, css } from '@emotion/core'
import _ from 'lodash'
import { Scrollbars } from 'react-custom-scrollbars'


import WyTable from '../components/WyTable'
import WyDatePicker from '../components/WyDatePicker'
import {wyAxiosPost} from '../components/WyAxios'
import WySpin from '../components/WySpin'
import { Header, Bodyer } from '../components/Amodule'
class TemplateForTable extends Component{
  state = {
    xData: [],
    yData: [],
    curTime: [],
    type: '',
    appname: '',
    field:'',
    xData:[],
    yData:[],
    aUnit:'',
    isSpaning: false,
    pageSize: 5
  }
  componentDidMount(){
    this._isMounted = true
    const { appname, field, type } = this.props

    if(this._isMounted){
      this.setState({
        type: type,
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
  pageSizeChange = (current, size)=>{
    if(this._isMounted){
      this.setState({
        pageSize: size
      })
    }
  }

  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return(
    <div>
      <Header>
        <div css={{display: "flex"}}>
          <div css={{flex:"1 1 auto"}}>{this.props.tab}</div>
          <div css={{flex:"0 0 380px"}}>
            <WyDatePicker
              curTime={this.state.curTime}
              rangeTimeChange={this.curTimeChange}
            />
          </div>
          </div>
        </Header>
        <Bodyer>
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height:"280px"}}
            >
              <WySpin isSpining={this.state.isSpaning}>
                <WyTable
                  xData={this.state.xData?this.state.xData:[]}
                  yData={this.state.yData?this.state.yData:[]}
                  pageSize={this.state.pageSize}
                  onPageSizeChange={this.pageSizeChange}
                />
              </WySpin>
            </Scrollbars>
          </Bodyer>
        </div>
    )
  }
}

export default TemplateForTable
