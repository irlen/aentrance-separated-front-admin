import React ,{ Component } from 'react'
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import _ from 'lodash'
import  { themeOne } from '../echartTheme'
import DropList from '../DropList'
class AlertLine extends Component{
  constructor(){
    super()
    const option = {
	    tooltip: {
    		trigger: 'axis',
    		axisPointer : {            // 坐标轴指示器，坐标轴触发有效
      		type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    		}
      },
      xAxis: {
          type: 'category',
		      boundaryGap: false,
          data: [] //横坐标数据
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value} M' //这里是单位
          }
      },

      series: [],
      grid:{ //视图个容器间距
        top: 30,
        bottom: 60,
        left: 60,
        right: 20,
        //containLabel: true
      },

      legend: {
        type: 'scroll',
        orient: 'horizontal',
        center: 0,
        bottom: 10,
        textStyle:{ //图例样式
        color: '#01D39F',
        fontSize:'12px'
      }
      }
    }

    this.state={
      option,
      onChartClick: function(){},
      viewId: '',
      onBrushSelected: function(){},
      onContextmenu: function(){return false},

      dropPosition:{x:"0px",y:"0px"},
      dropData: [],
      isexist: false
    }
  }

  componentDidMount(){
    const {xData,yData,aUnit,viewId,yMarkLine,xMarkLine,name} = this.props
    let onChartClick
    let onBrushSelected
    let onContextmenu
    let brush = {}
    let toolbox = {
      toolbox:{
        show: true,
        feature: {
          dataZoom:{}
        },
        iconStyle:{
          borderColor:'#01D39F',
        },
        emphasis:{
          iconStyle: {
            borderColor: '#ffffff'
          }
        }
      }
    }
    if(this.props.nozoom){
      toolbox = {
        toolbox:{
          show: true,
          iconStyle:{
            borderColor:'#01D39F',
          },
          emphasis:{
            iconStyle: {
              borderColor: '#ffffff'
            }
          }

        }
      }
    }
    //点击事件判断
    if(!this.props.onBrushSelected){
       onBrushSelected = function(){}
    }else{
       onBrushSelected = this.props.onBrushSelected
    }
    //点击事件判断
    if(!this.props.onChartClick){
       onChartClick = function(){}
    }else{
       onChartClick = this.props.onChartClick
    }
    //点击事件判断
    if(!this.props.onContextmenu){
       onContextmenu = function(){return false}
    }else{
       onContextmenu = this.props.onContextmenu
    }
    //判断是否有添加brush
    if(this.props.brush){
      brush = {
        brush:{
          toolbox: ['lineX','clear'],//选框类型
          xAxisIndex: 'all',//对所有x轴有效
          brushLink: 'all',//关联所有对象数据
          brushMode: 'single',//启用单选模式
          outOfBrush: { //选框透明度
              colorAlpha: 0.1
          },
          brushStyle:{ //选框样式
            borderWidth: 1,
            color: 'rgba(120,140,180,0.3)',
            borderColor: 'rgba(120,140,180,0.8)'
          },
          throttleType:'debounce',
          throttleDelay: 300
        }
      }
    }else{
      brush = {}
    }
    //判断工具盒是否添加
    // if(this.props.toolbox){
    //   toolbox = {
    //     toolbox: {
    //       feature: {
    //         dataZoom: {
    //           yAxisIndex: 'none'
    //         },
    //         restore: {},
    //         saveAsImage: {}
    //       }
    //     }
    //   }
    // }else{
    //   toolbox = {}
    // }

    this.setState({
      option: Object.assign({},{...this.state.option},{
        xAxis: {
            data: xData, //横坐标数据
            grid:{	 borderWidth:0,
           borderColor:'#e3b'
            },
            axisLine:{ //横坐标轴线
              show: false,
              lineStyle:{  //横坐标轴及其刻度颜色
                  color:'rgba(255,255,255,0.8)',
                  width:1
              }
            },
          axisLabel: { //横坐标文字
              show: true,
              textStyle: {
                  color: '#ffffff',
              }
          },
          splitLine: { //网格线
            show: false,
            //  改变轴线颜色
            lineStyle: {
                // 使用深浅的间隔色
                color: ['red']
            }
          },
          axisTick: {       //x轴刻度线
            show: false,
          }
        },
        yAxis: {
            axisLabel: {
                formatter: '{value}'+aUnit //这里是单位
            },
            axisLine:{
              show: false,
              lineStyle:{ //纵坐标轴及其刻度颜色
                color:'rgba(255,255,255,0.8)',
                width:1
              }
          },
          splitLine: { //网格线
            show: false,
            //  改变轴线颜色
            lineStyle: {
                // 使用深浅的间隔色
                color: ['red']
            }
        },
        axisTick: {       //y轴刻度线
            show: false
          }
        },
        series:[{
            data: yData,
            smooth:true,
            name: name,
            type: 'line',
            markLine: {
                silent: true,
                symbol:'none',
                label:{
                    show: true,
                    position:'middle',
                    formatter:'{c}',
                    color:"#FFFF33"
                },
                lineStyle:{
                    width: 2,
                    color: '#FF3333'
                },
                data: [{
                    yAxis: yMarkLine,

                },{
                    xAxis: xMarkLine
                }]
            }
        }],
        animationThreshold:true,
      },
      brush,
      toolbox
    ),
      onChartClick,
      viewId,
      onBrushSelected,
      onContextmenu
    })
  }
  componentWillReceiveProps(nextProps){
    if(!(
      JSON.stringify(_.cloneDeep(this.props.xData)) === JSON.stringify(_.cloneDeep(nextProps.xData)) &&
      JSON.stringify(_.cloneDeep(this.props.yData)) === JSON.stringify(_.cloneDeep(nextProps.yData)) &&
      this.props.aUnit === nextProps.aUnit &&
      this.props.name === nextProps.name
    )){
      const {xData,yData,aUnit,yMarkLine, xMarkLine, name} = _.cloneDeep(nextProps)

      this.setState({
        option: Object.assign({},{...this.state.option},{
          xAxis: {
              data: xData, //横坐标数据
              grid:{	 borderWidth:0,
             borderColor:'#e3b'
              },
              axisLine:{ //横坐标轴线
                show: false,
                lineStyle:{  //横坐标轴及其刻度颜色
                    color:'rgba(255,255,255,0.8)',
                    width:1
                }
              },
            axisLabel: { //横坐标文字
                show: true,
                textStyle: {
                    color: '#ffffff',
                }
            },
            splitLine: { //网格线
              show: false,
              //  改变轴线颜色
              lineStyle: {
                  // 使用深浅的间隔色
                  color: ['red']
              }
            },
            axisTick: {       //x轴刻度线
              show: false,
            }
          },
          yAxis: {
              axisLabel: {
                  formatter: '{value}'+aUnit //这里是单位
              },
              axisLine:{
                show: false,
                lineStyle:{ //纵坐标轴及其刻度颜色
                  color:'rgba(255,255,255,0.8)',
                  width:1
                }
            },
            splitLine: { //网格线
              show: false,
              //  改变轴线颜色
              lineStyle: {
                  // 使用深浅的间隔色
                  color: ['red']
              }
          },
          axisTick: {       //y轴刻度线
              show: false
            }
          },
          series:[{
              data: yData,
              smooth:true,
              name: name,
              type: 'line',
              markLine: {
                  silent: true,
                  symbol:'none',
                  label:{
                      show: true,
                      position:'middle',
                      formatter:'{c}',
                      color:"#FFFF33"
                  },
                  lineStyle:{
                      width: 2,
                      color: '#FF3333'
                  },
                  data: [{
                      yAxis: yMarkLine,

                  },{
                      xAxis: xMarkLine
                  }]
              }
          }]
        }),
        dropPosition: nextProps.dropListInfo?nextProps.dropListInfo.dropPosition:{x:"0px",y:"0px"},
        dropData: nextProps.dropListInfo?nextProps.dropListInfo.dropData:[],
        isexist: nextProps.dropListInfo?nextProps.dropListInfo.isexist:false
      })
    }
  }

  render(){
    echarts.registerTheme('my_theme',themeOne)
    return(
      <div>
        <ReactEcharts
          option={this.state.option}
          theme={'my_theme'}
          style={{height: this.props.height?this.props.height+"px":"300px"}}
          onEvents={
            {
              'click': (params,viewId)=>{this.state.onChartClick(params,this.state.viewId)},
              'contextmenu':(params,viewId)=>{
                const xPosition = params.event.event.clientX
                const yPosition = params.event.event.clientY
                const position= {
                  x: xPosition,
                  y: yPosition
                }
                const dom = params.event.event.target
                const curViewId = this.state.viewId
                this.state.onContextmenu(params,dom,position,curViewId)
              },
              'brushSelected' : (params,viewId)=>{this.state.onBrushSelected(params,this.state.viewId)}
            }
          }
          opts={{renderer: 'canvas'}}
        />
      </div>
    )
  }
}

export default AlertLine


//viewId 视图ID，通常指这个视图的这条数据ID
//xData  横轴数据，为数组
//yData  纵轴数据，为数组
// [{
//      name:'邮件营销',
//      type:'line',
//      data:[120, 132, 101, 134, 90, 230, 210]
//  },
//  {
//      name:'联盟广告',
//      type:'line',
//      data:[220, 182, 191, 234, 290, 330, 310]
//  }]
//aUnit  单位，字符串
//toolbox  值为布尔值，是否开启工具盒 默认为false
//brush 值为布尔值，是否开启刷子工具  默认为false
//onChartClick  值为一个函数，默认为空
//onBrushSelected 值为一个函数，默认为空
