import React ,{ Component } from 'react'
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import { themeOne } from '../echartTheme'
class Bar extends Component{
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
        right: 20
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        center: 0,
        bottom: 10,
      },
    }

    this.state={
      option
    }
  }
  componentDidMount(){
    const {xData,yData,aUnit} = this.props
    this.setState({
      option: Object.assign({},{...this.state.option},{
        xAxis: {
            data: xData //横坐标数据
        },
        yAxis: {
            axisLabel: {
                formatter: '{value}'+aUnit //这里是单位
            }
        },
        series: yData
      })
    })
  }
  componentWillReceiveProps(nextProps){
    const {xData,yData,aUnit} = nextProps
    this.setState({
      option: Object.assign({},{...this.state.option},{
        xAxis: {
            data: xData //横坐标数据
        },
        yAxis: {
            axisLabel: {
                formatter: '{value}'+aUnit //这里是单位
            }
        },
        series: yData
      })
    })
  }

  render(){
    echarts.registerTheme('my_theme',
      themeOne
    )
    return(
      <ReactEcharts
        option={this.state.option}
        theme="my_theme"
      />
    )
  }
}

export default Bar
//xData  横轴数据，为数组
//yData  纵轴数据，为数组
//aUnit  单位，字符串
