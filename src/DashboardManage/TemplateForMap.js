import React, { Component } from 'react'
import _ from 'lodash'
import { wyAxiosPost } from '../components/WyAxios'
import WySpin from '../components/WySpin'
import Map from '../components/Map'
import mapStyle from './mapStyle'
import * as regions from './regions'

class TemplateForMap extends Component{
  state = {
    mapData:{},
    autoHeight: 0,
    id:'',
    showViewData:{},
    updateTime: 0
  }
  getCurViewData = ()=>{
    if(this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0){
      const info = _.cloneDeep(this.state.showViewData.data)
      info.viewType = this.state.showViewData.viewType
      info.pageId = this.props.pageId
      wyAxiosPost('Dashboard/getModuleData',{info},(result)=>{
        const responseData = result.data.msg
        let checkCityList = {}
        const cityList = regions[responseData.region]
        if(cityList && cityList.length>0){
          cityList.map(item=>{
            checkCityList[item.name] = item.coordinate
          })
        }
        const compiledLineData = ()=>{
          const lineData = _.cloneDeep(responseData.lineData)
          if(lineData && lineData.length>0){
            lineData.map(item=>{
                const coords = []
                coords.push(checkCityList[item.fromCity])
                coords.push(checkCityList[item.toCity])
                item.coords = coords
                if(item.value === '0'){
                  //流量为零的时候，控制发光效果和线条颜色
                  item.lightColor= 'rgba(255,255,255,0)' //无流量时发光效果的颜色
                  item.lineColor = 'rgba(0,248,255,1)' //无流量时线条颜色
                }else{
                  item.lightColor= 'rgba(255,255,255,0.64)' //有流量时发光效果颜色
                  item.lineColor = 'rgba(255,255,0,1)' //有流量时线条颜色
                }
            })
          }
          return lineData
        }
        const compiledPointData = ()=>{
          let pointData = _.cloneDeep(responseData.pointData)
          if(pointData && pointData.length>0){
            pointData.map(item=>{
              let newValue = []
              newValue = checkCityList[item.city]
              newValue.push(item.value)
              item.value = newValue
              // if(item.warning === 'normal'){
              //   item.color="rgba(0,255,0,1)" //无告警时候节点颜色
              // }else if(item.warning === 'slight'){
              //   item.color="rgba(255,241,0,1)" //轻微告警节点颜色
              // }else if(item.warning === 'serious'){
              //   item.color="rgba(255,123,69,1)" //严重告警节点颜色
              // }
            })
          }
          return pointData
        }
        const mapData = {}
        mapData.lineData = compiledLineData()
        mapData.pointData = compiledPointData()
        mapData.region = responseData.region
        mapData.unit = responseData.unit
        mapData.mapName = responseData.map_name
        if(this._isMounted){
          this.setState({
            mapData
          })
        }
      })
    }
  }
  //数据更新
  updateData = ()=>{
    if(this.mapTimer1){
      clearInterval(this.mapTimer1)
    }
    const run = ()=>{
      if(this.state.updateTime !== 0){
        if(this.mapTimer2){
          clearInterval(this.mapTimer2)
        }
        let time = this.state.updateTime
        this.mapTimer2 = setInterval(()=>{
          this.getCurViewData()
        },time*1000)
        if(this.mapTimer1){
          clearInterval(this.mapTimer1)
        }
      }else{
        if(this.mapTimer2){
          clearInterval(this.mapTimer2)
        }
      }
    }
    this.mapTimer1 = setInterval(run,5000)
  }
  componentDidMount(){
    this._isMounted = true
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
    if(this.props.env !== 'set'){
      this.timerMap = setTimeout(()=>{
        this.getCurViewData()
      },1000)
    }
  }
  componentWillReceiveProps(nextProps){
    if(
      ! _.isEqual(this.props.showViewData,nextProps.showViewData) ||
      this.props.autoHeight !== nextProps.autoHeight ||
      (this.props.updateTime && nextProps.upDateTime && this.props.updateTime !== nextProps.upDateTime)
    ){
      if(this._isMounted){
        this.setState({
          showViewData: nextProps.showViewData,
          autoHeight: nextProps.autoHeight,
          updateTime: nextProps.updateTime
        },()=>{
          this.getCurViewData()
          if(this.state.updateTime && this.props.env !== 'set'){
            this.updateData()
          }
        })
      }
    }
  }
  componentWillUnmount(){
    if(this.timerMap){
      clearInterval(this.timerMap)
    }
    if(this.mapTimer1){
      clearInterval(this.mapTimer1)
    }
    if(this.mapTimer2){
      clearInterval(this.mapTimer2)
    }
    this._isMounted = false
  }
  render(){
    return(
      <div className="amodule" style={{margin:"0px",background: mapStyle.moduleBackground}}>
        {
          this.props.env === 'set'?
          ''
          :
          <div className="moduleHeader" style={{
            display:"flex",
            background:"rgba(255,255,255,0)"
          }}>
            {this.state.showViewData.data && Object.keys(this.state.showViewData.data).length>0?this.state.showViewData.data.moduleName:''}
          </div>
        }
        <div className="moduleBody" style={{
          background:"rgba(255,255,255,0)"
        }}>
          <Map height={this.state.autoHeight} mapData={this.state.mapData}/>
        </div>
      </div>
    )
  }
}

export default TemplateForMap
