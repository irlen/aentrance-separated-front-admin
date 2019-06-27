import React from 'react'
import { connect } from 'react-redux'
import { addModules,setPosition, initModules } from '../actions'
import AddView from './AddView'


const mapStateToProps  = (state)=>({
  modules: state.homeview.modules
})
const mapDispatchToProps = (dispatch)=>({
  doAdd: (moduleData)=>{dispatch(addModules(moduleData))},
  // doSetPosition : (positions)=>{
  //   dispatch(setPosition(positions))
  // },
  // doInitModules: (modulesData)=>{
  //   dispatch(initModules(modulesData))
  // }
})
export default connect(mapStateToProps,mapDispatchToProps)(AddView)
