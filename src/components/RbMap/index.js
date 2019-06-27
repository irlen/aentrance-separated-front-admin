/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React ,{ Component } from 'react'
import _ from 'lodash'
import {Map, Marker, NavigationControl, InfoWindow, MapTypeControl, ScaleControl, OverviewMapControl} from 'react-bmap'

const markerStyle = {
  minWidth:'160px',height: 'auto', lineHeight: '20px', background: '#009966', color:'#ffffff',borderRadius:'40px',
  boxShadow:"0px 0px 5px 1px rgba(0,204,102,1)",textAlign:"left",padding: "0 20px 0 20px",
  cursor:"pointer",
  "&:hover":{opacity:"0.8"},
  "&:active":{opacity:"1"},
}
class RbMap extends Component{
  //属性
  //mapStyle={{style: 'midnight'}} 样式配置
  //events={this.getEvents()} // 为地图添加各类监听事件
  state={
    curProps:{}
  }
  componentDidMount(){
    this._isMounted = true
    const curProps = _.cloneDeep(this.props)
    if(this._isMounted){
      this.setState({
        curProps
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(! _.isEqual(this.props,nextProps)){
      if(this._isMounted){
        this.setState({
          curProps: _.cloneDeep(nextProps)
        })
      }
    }
  }

  componentWillUnmount(){
    this._isMounted =  false
  }

  render(){
    const BMap = window.BMap
    const {center,zoom} = this.state.curProps
    return(
      <Map
        center={center?center:{lng: 114.0661345267, lat: 22.5485544122}}
        zoom={zoom?zoom:'11'}
        style={{height:"100%"}}
        enableScrollWheelZoom={true}

      >
          <Marker position={{lng: 114.1671345267, lat: 22.5485544122}} />
          <InfoWindow position={{lng: 114.0661345267, lat: 22.5485544122}} text="内容" title="标题"/>
          <NavigationControl offset={new BMap.Size(10,55)} />
          <MapTypeControl offset={new BMap.Size(10,55)} />
          <ScaleControl />
          <OverviewMapControl />

          <Marker position={{lng: 114.3527681268, lat: 22.6971726959}} offset={new BMap.Size(-75, -60)}>
              <div
                onClick={function(){alert('返回区域ID和产业ID')}}
                css={markerStyle}>
                  <div>区域：坪山新区</div>
                  <div>个数：12344</div>
              </div>
          </Marker>
          <Marker position={{lng: 114.0610959122, lat: 22.5286896086}} offset={new BMap.Size(-75, -60)}>
              <div
                onClick={function(){alert('返回区域ID和产业ID')}}
                css={markerStyle}>
                  <div>区域：福田</div>
                  <div>个数：23444</div>
              </div>
          </Marker>
          <Marker position={{lng: 113.9369366556, lat: 22.5389728649}} offset={new BMap.Size(-75, -60)}>
              <div
                onClick={function(){alert('返回区域ID和产业ID')}}
                css={markerStyle}>
                  <div>区域：南山</div>
                  <div>个数：23444</div>
              </div>
          </Marker>
          <Marker position={{lng: 114.2542519005, lat: 22.7261548561}} offset={new BMap.Size(-75, -60)}>
              <div
                onClick={function(){alert('返回区域ID和产业ID')}}
                css={markerStyle}>
                  <div>区域：龙岗</div>
                  <div>个数：23444</div>
              </div>
          </Marker>

      </Map>
    )
  }
}

export default RbMap
