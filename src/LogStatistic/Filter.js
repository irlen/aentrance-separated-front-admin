/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { withTheme } from 'emotion-theming'

const FilterStyle = styled.div({
  lineHeight:"26px",
  background:"rgba(255,255,255,0.1)",
  minWidth: "100px",
  borderRadius:"20px",
  padding: "0 20px 0 20px",
  cursor:"pointer",
  position: "relative",
  display:"inline-block",
  fontSize:"12px"
})
const InStyle = styled.div({
  position:'absolute',
  left:"0px", top:"0px",
  width:"100%",
  background:"rgba(0,0,0,0.8)",
  borderRadius:"20px",
  padding: "0 10px 0 10px"
})
class Filter extends Component{
  state={
    show: "none"
  }
  componentDidMount(){
    this._isMounted = true
  }
  mouseOver = ()=>{
    if(this._isMounted){
      this.setState({
        show: "block"
      })
    }
  }
  mouseOut = ()=>{
    if(this._isMounted){
      this.setState({
        show: "none"
      })
    }
  }
  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    return (
        <FilterStyle
          onMouseOver={this.mouseOver}
          onMouseOut={this.mouseOut}
          css={{background:"#009999"}}
        >
          {this.props.filterData.filter_name}
          <InStyle css={{display:this.state.show}}>
            <Row>
              <Col title='删除过滤器' span={8} css={{textAlign:"center","&:hover":{color:this.props.theme.selectFontColor}}}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </Col>
              <Col title='编辑过滤器' span={8} css={{textAlign:"center","&:hover":{color:this.props.theme.selectFontColor}}}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
              </Col>
              {
                this.props.filterData.filter_run === 'yes'?
                <Col title='撤销过滤' span={8} css={{textAlign:"center","&:hover":{color:this.props.theme.selectFontColor}}}>
                  <i className="fa fa-pause-circle-o" aria-hidden="true"></i>
                </Col>
                :
                <Col title='加入过滤' span={8} css={{textAlign:"center","&:hover":{color:this.props.theme.selectFontColor}}}>
                  <i className="fa fa-play-circle-o" aria-hidden="true"></i>
                </Col>
              }

            </Row>
          </InStyle>
        </FilterStyle>
    )
  }
}


export default withTheme(Filter)
