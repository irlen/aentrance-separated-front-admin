import React, { Component } from 'react'
import { Spin } from 'antd'

class WySpin extends Component{
  state={
    isSpining: true
  }
  componentDidMount(){
    this.setState({
      isSpining: this.props.isSpining
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      isSpining: nextProps.isSpining
    })
  }
  render(){
    return(
      <Spin spinning={this.state.isSpining} size='large'>
        {this.props.children}
      </Spin>
    )
  }
}

export default WySpin
