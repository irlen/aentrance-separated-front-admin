import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'


import { deepBlue } from './mapStyle'
class BdMap extends Component{
  state = {
    curProps:{}
  }

  componentDidMount(){
    this._isMounted = true
    if(this._isMounted){
      this.setState({
        curProps : _.cloneDeep(this.props)
      })
    }
//*地图的创建*******************************************************************************************************
    const BMap = window.BMap
    const { BMapLib,INFOBOX_AT_TOP } = window
    const map = new BMap.Map('mapContainer')
    //地图显示的中心点
    const point = new BMap.Point(116.404, 39.915)
    //地图中心和缩放值
    map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom() //滚轮缩放
    map.addControl(new BMap.NavigationControl()) //平移控件
    map.addControl(new BMap.ScaleControl()) //缩放控件
    map.addControl(new BMap.OverviewMapControl()) //比例尺控件
    map.addControl(new BMap.MapTypeControl()) //地图类型选择控件
    map.setCurrentCity("北京") // 仅当设置城市信息时，MapTypeControl的切换功能才能可用

    //设置地图样式
    //map.setMapStyleV2({styleJson:deepBlue})
//*地图的创建*********************************************************************************************************
    //自定义标注

    //添加信息窗口
    const dom = "<div><div>你搜索的对象</div><div>参数展示</div></div>"
    const infoBox = new BMapLib.InfoBox(map,dom,{
      boxStyle:{
        background:"#3399cc",
        width:"200px",
        height:"200px",
      },
      closeIconMargin:"1px 1px 0 0",
      enableAutoPan: true,
      align: INFOBOX_AT_TOP
    })

    const marker = new BMap.Marker(point)
    map.addOverlay(marker)
    infoBox.open(marker)
    marker.enableDragging()
    // $("close").onclick = ()=>{
    //   infoBox.close()
    // }
    // $("open").onclick = ()=>{
    //   infoBox.open(marker)
    // }





  }

  render(){
    return (
      <div  id="mapContainer" style={{width:"100%",height:"100%"}} >

      </div>
    )
  }
}

export default BdMap
