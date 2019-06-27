import React ,{ Component } from 'react'
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import china from './maps/china.js'
import world from './maps/world.js'
import shenzhen from './maps/shenzhen.js'
import usa from './maps/usa.js'

import _ from 'lodash'
import { themeOne } from '../echartTheme'
import DropList from '../DropList'
class Map extends Component{
  constructor(props){
    super(props);
    this.state = {
      lineData:[],
      pointData:[],
      region:'china',
      unit:'kb',
      mapName:''
    }
  }
  componentDidMount(){
    if(JSON.stringify(this.props.mapData).length>2){
      const { lineData, pointData, region, unit, mapName} = this.props.mapData
      this.setState({
        lineData, pointData, region, unit
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(
      ! _.isEqual(this.props.mapData,nextProps.mapData) ||
      this.props.height !== nextProps.height
    ){
      const { lineData, pointData, region, unit, mapName} = nextProps.mapData
      this.setState({
        lineData, pointData, region, unit, mapName
      })
    }
  }
  getOption = ()=>{
    //const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
    const planePath = 'arrow'
    const colors = ['#a6c84c', '#ffa022', '#46bee9'];
    const series = [];
    series.push(
    { //后面发光的效果
        name: '',
        type: 'lines',
        zlevel: 1,
        effect: { //发光体特效
            show: true,
            period: 6,
            trailLength: 0.7,
            //color: 'rgba(255,255,255,0.5)',
            symbolSize: 3, //发光体的大小
        },
        lineStyle: {
            normal: {
                color: (params)=>{return params.data.lightColor}, //移动发光体颜色
                width: 0,
                curveness: 0.2
            }
        },
        data: this.state.lineData  //地图数据
    },
    { //连线和箭头
        name: '',
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'arrow'],//连线两端，起始端无箭头，终点端有箭头
        symbolSize: 5,
        effect: { //连线和箭头特效
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 1
        },
        lineStyle: {
            normal: {
                color: (params)=>{return params.data.lineColor}, //连线颜色
                width: 1,
                opacity: 0.6,
                curveness: 0.2
            }
        },
        data: this.state.lineData //地图数据
    },
    { //节点配置
        name: '',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: { //涟漪特效相关配置
            brushType: 'stroke', //波纹绘制方式，'stroke','fill'
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
            }
        },
        //symbol: ['none', 'none'],//节点形状
        symbolSize: 10,//节点大小
        itemStyle: {
            normal: {
                color: (params)=>{return params.data.color} //节点颜色
            }
        },
        data: this.state.pointData
    });

    const option = {
       backgroundColor: 'rgba(0,0,0,0)',//地图背景色
       title : {
           text: '',
           subtext: '',
           left: 'center',
           textStyle : {
               color: 'rgba(255,255,255,0.8)',
               lineHeight:"20px",
           }
       },
       layoutCenter:['50%','50%'], //地图位置
			 layoutSize: '120%', //地图放大比例
       tooltip : {
           trigger: 'item',
           formatter: (params)=>{
      		  if (params.componentSubType === "effectScatter"){    // is edge
      				return '节点为：'+params.data.name+'<br/>'+'流量：'+params.data.value[2]+''+this.state.unit;
            }else if(params.componentSubType === "lines"){
              return '源：'+params.data.fromName+'<br/>'+'目的：'+params.data.toName+'<br/>'+'流量：'+params.data.value+''+this.state.unit;
            }
				 }
       },
       legend: { //图例为空
           orient: 'vertical',
           top: 'bottom',
           left: 'right',
           data:[],
           textStyle: {
               color: '#fff'
           },
           selectedMode: 'single'
       },
       geo: { //地图选择
           map: this.state.region,
           label: {
               emphasis: {
                   show: false
               }
           },
           roam: true,
           itemStyle: { //地图样式
               normal: {
                 areaColor: '	rgba(1,211,159,0.1)', //地图颜色
                 borderColor: 'rgba(0,255,255,0.88)'//区域分界线颜色
                                },
               emphasis: {
                 areaColor: 'rgba(0,251,255,0.56)', //鼠标移入颜色
                 borderColor: 'rgba(255,255,255,0.88)'//区域分界线颜色
               }
           }
       },
       series: series
   };
    return option;
  }
  render(){
    echarts.registerTheme('my_theme',themeOne)
    return(
      <div>
        <ReactEcharts
          option={this.getOption()}
          theme="my_theme"
          opts={{renderer: 'canvas'}}
          style={{height: this.props.height?this.props.height+'px':'400px', width: '100%'}}
        />
        <DropList
          dropPosition={_.cloneDeep(this.state.dropPosition)}
          dropData={_.cloneDeep(this.state.dropData)}
          isexist={_.cloneDeep(this.state.isexist)}/>
      </div>
    )
  }
}

export default Map

//数据
// lineData = [
//   {
//     fromName: '上海',
//     toName: '东莞',
//     coords: [[121.4648,31.2891],[113.8953,22.901], 后台传过来没有，需要转化该字段
//     value: 12
//   },{
//     fromName: '杭州',
//     toName: '渭南',
//     coords:[[119.5313,29.8773],[109.7864,35.0299]],
//     value: 20
//   },
// ]

// pointData = [
//   {
//     name: '上海',
//     value: [121.4648,31.2891,10],  //经纬度和value组成的数组，后台传过来只有字符串value，没有坐标值，需转化
//     symbolSize: 10  //节点大小，根据pointData.value值算出相对大小
//   }
// ]

//region: 'china' 地图类型

//unit : 'kb'  单位
