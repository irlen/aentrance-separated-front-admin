import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'
import $ from 'jquery'
import { withRouter } from 'react-router-dom'

import WyTable from '../components/WyTable'
import { wyAxiosPost } from '../components/WyAxios'
import WyDatePicker from '../components/WyDatePicker'
import WySpin from '../components/WySpin'
//import contextList from '../SubPage/ContextList'
class TemplateForTable extends Component{
  state = {
    showViewData: {},
    xData: [],
    yData: [],

    subTime: [],
    isSpining: false,
    autoHeight: 0,

    pageSize: 10,
    updateTime: 0
  }
  //获取数据
  getCurViewData = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = {}
      info.viewType = this.state.showViewData.viewType
      info.api = this.state.showViewData.data.dataMethod
      if(this.state.subTime.length>0 && this.props.env !== 'set'){
        info.start_time = this.state.subTime[0]
        info.last_time = this.state.subTime[1]
      }
      wyAxiosPost('Screen/getScreenData',{info},(result)=>{
        const responseData = result.data.msg
        if(this.state.subTime.length === 0){
          const curTime = []
          curTime.push(responseData.start_time)
          curTime.push(responseData.last_time)
          this.setState({
            xData: responseData.xxx,
            yData: responseData.yyy,
            subTime: _.cloneDeep(curTime)
          })
        }else{
          this.setState({
            xData: responseData.xxx,
            yData: responseData.yyy,
          })
        }
      })
    }
  }
  getCurViewDataForFresh = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = {}
      info.viewType = this.state.showViewData.viewType
      info.api = this.state.showViewData.data.dataMethod
      wyAxiosPost('Screen/getScreenData',{info},(result)=>{
        const responseData = result.data.msg
        const curTime = []
        curTime.push(responseData.start_time)
        curTime.push(responseData.last_time)
        this.setState({
          xData: responseData.xxx,
          yData: responseData.yyy,
          subTime: _.cloneDeep(curTime)
        })
      })
    }
  }
  //数据更新
  updateData = ()=>{
    if(this.tableTimer1){
      clearInterval(this.tableTimer1)
    }
    const run = ()=>{
      if(this.state.updateTime !== 0){
        if(this.tableTimer2){
          clearInterval(this.tableTimer2)
        }
        let time = this.state.updateTime
        this.tableTimer2 = setInterval(()=>{
          this.getCurViewDataForFresh()
        },time*1000)
        if(this.tableTimer1){
          clearInterval(this.tableTimer1)
        }
      }else{
        if(this.tableTimer2){
          clearInterval(this.tableTimer2)
        }
      }
    }
    this.tableTimer1 = setInterval(run,5000)
  }
  componentDidMount(){
    if(this.props.showViewData.id){
      this.setState({
        showViewData: this.props.showViewData,
        autoHeight: this.props.autoHeight,
        updateTime: this.props.updateTime
      },()=>{
        this.getCurViewData()
        if(this.state.updateTime && this.props.env !== 'set'){
          this.updateData()
        }
      })
    }

  }
  subTimeChange = (value,event)=>{
    this.setState({
      subTime: value
    },()=>{
      this.getCurViewData()
    })
  }
  pageSizeChange = (current, size)=>{
    this.setState({
      pageSize: size
    })
  }
  componentWillReceiveProps(nextProps){
    if(
      ! (_.isEqual(this.props.showViewData,nextProps.showViewData)) ||
      this.props.autoHeight !== nextProps.autoHeight ||
      (this.props.updateTime && nextProps.upDateTime && this.props.updateTime !== nextProps.upDateTime)
    ){
      this.setState({
        showViewData: nextProps.showViewData,
        autoHeight: nextProps.autoHeight
      },()=>{
        this.getCurViewData()
        if(this.state.updateTime && this.props.env !== 'set'){
          this.updateData()
        }
      })
    }
  }

  componentWillUnmount(){
    if(this.tableTimer1){
      clearInterval(this.tableTimer1)
    }
    if(this.tableTimer2){
      clearInterval(this.tableTimer2)
    }
  }
  tableContextmenu = (record,position,dom)=>{
    $('.drcontainer').removeClass('dropShow').addClass('dropHide')
    $(dom).closest('.gridContainer').find('.drcontainer').removeClass('dropHide').addClass('dropShow')

    // if(this.state.secondData){
    //   if(this.state.secondData.is_app === 'no'){
    //     const {listType,objType} = this.state.secondData
    //     console.log(params)
    //     let info ={
    //       listType,
    //       start_time: this.state.subTime[0],
    //       last_time: this.state.subTime[1],
    //       obj: params.name,
    //       objType,
    //       previousPath:this.props.location.pathname
    //     }
    //     this.props.setDropListInfo({
    //        dropData: contextList(info),
    //        dropPosition: {x:position.x+"px",y:position.y+"px"},
    //        isexist: true
    //     })
    //   }
    // }
  }
  render(){
    return(
      <div className="amodule" style={{margin:"0px"}}>
        {
          this.props.env === 'set'?
          ''
          :
          <div className="moduleHeader" style={{display:"flex"}}>
            <div className="moduleHeaderIn"style={{flex:"1 1 auto"}}>
              {this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0?this.state.showViewData.data.moduleName:''}
            </div>
              <div style={{float: "right",flex:"0 0 300px"}}>
                <WyDatePicker curTime={this.state.subTime} rangeTimeChange={this.subTimeChange}/>
              </div>
          </div>
        }
        <div className="moduleBody">
          <Scrollbars
            autoHide
            autoHideTimeout={100}
            autoHideDuration={200}
            universal={true}
            style={{height: this.state.autoHeight+'px'}}
            >
              <WySpin isSpining={this.state.isSpining}>
                <WyTable
                  xData={this.state.xData?this.state.xData:[]}
                  yData={this.state.yData?this.state.yData:[]}
                  pageSize={this.state.pageSize}
                  onShowSizeChange={this.pageSizeChange}
                  //onTableContextmenu={this.tableContextmenu}
                />
              </WySpin>
          </Scrollbars>
        </div>
      </div>
    )
  }
}

export default withRouter(TemplateForTable)
