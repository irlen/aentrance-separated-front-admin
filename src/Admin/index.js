import React from 'react'
//import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import $ from 'jquery'

import Header from './header'
import { userLogout } from '../actions'
import Container from './Container'
class Admin extends React.Component {
  render(){
    return(
      <div className="adminContainer">
        <Header />
        <Container />
      </div>
    )
  }
}

export default Admin
