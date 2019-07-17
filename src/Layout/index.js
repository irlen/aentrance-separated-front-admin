import { connect } from 'react-redux'
import Layout from './Layout'
import { setWindowH } from '../actions'

const mapStateToProps = (state)=>({
  //navWidth: state.nav.navWidth,
  //collapsed: state.nav.collapsed,
  windowH: state.height
})
const mapDispatchToProps = (dispatch)=>({
  setWindowH: (windowH)=>{dispatch(setWindowH(windowH))}
})

export default connect(mapStateToProps,mapDispatchToProps)(Layout)
