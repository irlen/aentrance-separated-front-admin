import React, { Component } from 'react'
import { DatePicker } from 'antd';
import moment from 'moment';
import propTypes from 'prop-types'
import _ from 'lodash'
const RangePicker = DatePicker.RangePicker;
const now1 = moment()
const now2 = moment()
const Now = now1.add(0,'h')
const oneHourBefore = now2.subtract(1,'h')
class WyDatePicker extends Component{
  state={
    curTime: [],
    isSubmit: false
  }

  componentDidMount(){
      const { curTime } = this.props
      this.setState({
        curTime,
        isSubmit: false
      })
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(_.cloneDeep(this.props.curTime)) !== JSON.stringify(_.cloneDeep(nextProps.curTime))){
      const { curTime } = nextProps
      this.setState({
        curTime,
        isSubmit: false
      })
    }
  }


  rangeTimeChange = (dates, dateStrings)=>{
    this.setState({
      curTime: [...dateStrings],
      isSubmit: false
    })
  }

  //时间下拉隐藏回调函数，检测
  // getSlideStatus = (status)=>{
  //   if(status === false && this.props.rangeTimeChange){
  //     console.log('消失')
  //     console.log(this.state.curTime)
  //     this.props.rangeTimeChange(this.state.curTime)
  //   }
  // }
  componentWillUpdate(nextProps,nextState){
    if(this.props.rangeTimeChange && nextState.isSubmit === true){
      this.props.rangeTimeChange(nextState.curTime)
      this.setState({
        isSubmit: false
      })
    }
  }
  timeOk=()=>{
    this.setState({
      isSubmit: true
    })
  }
  //不可选时间
  disabledDate = (current)=>{
    return current && current>moment().endOf('day')
  }

  //defaultValue={[moment(oneHourBefore,'YYYY-MM-DD HH:mm'),moment(Now,'YYYY-MM-DD HH:mm')]}
  render(){
    return(
        <RangePicker
            size={this.props.size?this.props.size: 'small'}
            style={this.props.style?this.props.style:{width:"100%",maxWidth:"360px"}}
            allowClear={false}
            ranges={{
              '当前小时':[moment().startOf('hour'), moment()],
              '今天':[moment().startOf('day'), moment()],
              '本周':[moment().startOf('week'), moment()],
              '本月':[moment().startOf('month'), moment()],
              '本年度':[moment().startOf('year'), moment()],

              '最近一小时':[moment().subtract(1,'h'),moment()],
              '最近15分钟':[moment().subtract(15,'m'),moment()],
              '最近30分钟':[moment().subtract(30,'m'),moment()],
              '最近一天': [moment().subtract(1,'d'), moment()],
              '最近一周': [moment().subtract(1,'w'), moment()],
              '最近一个月': [moment().subtract(1,'M'), moment()],
              '最近一年': [moment().subtract(1,'y'), moment()]
            }}
            disabledDate={this.disabledDate}
            showTime={{format:'HH:mm:ss'}}
            format="YYYY-MM-DD HH:mm:ss"
            value={this.state.curTime && this.state.curTime.length >0? [moment(this.state.curTime[0],'YYYY-MM-DD HH:mm:ss'),moment(this.state.curTime[1],'YYYY-MM-DD HH:mm:ss')]:[]}
            onChange={this.rangeTimeChange}
            onOk={this.timeOk}
        />
    )
  }
}

WyDatePicker.propTypes = {
  curTime: propTypes.array,
  rangeTimeChange: propTypes.func
}

export default WyDatePicker
