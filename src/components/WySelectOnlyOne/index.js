import React, { Component } from 'react'

import { Select } from 'antd'
const Option = Select.Option


class WySelectOnlyOne extends Component{
  state={
    selValue: []
  }
  selChange = (value)=>{
    console.log(value)
    if(value.length>0){
      const lastOne = value.pop()
      let arr =[]
      arr.push(lastOne)
      if(this.props.onChange){
        this.props.onChange(arr)
      }
      this.setState({
        selValue: [...arr]
      })
    }else if(value.length === 0){
      const arr = []
      if(this.props.onChange){
        this.props.onChange(arr)
      }
      this.setState({
        selValue: []
      })
    }
  }
  render(){
    return(
      <div>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="请选择或输入"
          onChange={this.selChange}
          value={this.state.selValue.length>0?this.state.selValue : []}
        >

        </Select>
      </div>
    )
  }
}


export default WySelectOnlyOne
