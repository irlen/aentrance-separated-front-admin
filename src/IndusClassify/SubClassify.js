/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'lodash'

class SubClassify extends Component{
  constructor(props){
    super(props)
    this.moduleStyle = {
      flex:"0 0 20%",
      padding:"20px 10px 20px 10px"
    }
  }
  state = {
    showId: [],
    rank:'',
    indus: {}
  }
  componentDidMount(){
    this._isMounted = true
    if(this._isMounted){
      const { showId, rank, indus } = this.props
      this.setState({
        showId,
        rank,
        indus
      })
    }
  }

  componentWillReceiveProps(nextProps){
    let {showId, rank, indus} = this.props
    const  curp = {showId, rank, indus}
    const nexp = { showId: nextProps.showId, rank: nextProps.rank, indus: nextProps.indus }
    if(! _.isEqual(curp,nexp)){
      this.setState({
        showId: nextProps.showId,
        rank: nextProps.rank,
        indus: nextProps.indus
      })
    }
  }

  componentWillUnmount(){
    this._isMounted = false
  }
  render(){
    let selId = ''
    if(this.state.showId && this.state.showId.length>0){
      const indexArr = ['one','two','three','four','five']
      const curIndex = indexArr.indexOf(this.state.rank)
      const idLen = this.state.showId.length -1
      if(curIndex<idLen || curIndex == idLen){
        selId = this.state.showId[curIndex]
      }
    }

    const curList = []


    return (
      <div css={this.moduleStyle}>
        <Scrollbars
          autoHide
          autoHideTimeout={100}
          autoHideDuration={200}
          universal={true}
          style={{height:`${this.props.windowH-200}px`}}
        >
          <div css={{background:"#f9f9f9",padding:"10px",borderRadius:"5px"}}>
            <div css={{lineHeight:"40px"}}>操作</div>
            <div css={{cursor:"pointer",lineHeight:"40px"}}>
              {
                this.state.indus && Object.keys(this.state.indus).length>0?
                this.state.indus[this.state.rank].map((item,index)=>{
                  if(selId !== '' && selId === item.id){
                    return <div css={{color:"#3399cc",fontWeight:"bold"}} id={item.id} key={item.id}>{item.name}</div>
                  }else{
                    return <div id={item.id} key={item.id}>{item.name}</div>
                  }
                })
                :
                ''
              }
            </div>
          </div>
        </Scrollbars>
      </div>

    )
  }
}

const mapStateToProps = (state)=>({
  windowH: state.windowH.windowH,
  indus: state.indus
})

export default connect(mapStateToProps,null)(SubClassify)
