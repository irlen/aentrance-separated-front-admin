/** @jsx jsx */
import React, { Component } from 'react'
import { withTheme } from 'emotion-theming'
import { jsx, css } from '@emotion/core'

const Whole = (props)=>{
  return (
    <div css={{
      background: props.theme.moduleBg,
      borderRadius: props.theme.moduleBorderRadius,
      padding: props.theme.modulePadding
    }}>
      {props.children}
    </div>
  )
}
const Head = (props)=>{
  return(
    <div css={{height:"30px",lineHeight:"30px"}}>
      {props.children}
    </div>
  )
}

const Body = (props)=>{
  return(
    <div css={{height:"310px",paddingTop:"10px"}}>
      {props.children}
    </div>
  )
}


const Amodule = withTheme(Whole)
const Header = withTheme(Head)
const Bodyer = withTheme(Body)

export { Amodule, Header, Bodyer }
