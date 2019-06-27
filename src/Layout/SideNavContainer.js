import { connect } from 'react-redux'
import { doToggle } from '../actions'
import SideNav from './SideNav'

const mapDispatchToProps = (dispatch)=>({
  doToggle:(collapsed)=>dispatch(doToggle(collapsed))
})

export default connect(null,mapDispatchToProps)(SideNav)
