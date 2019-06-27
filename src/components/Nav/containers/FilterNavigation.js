import { connect } from 'react-redux'
import Navigation from '../components/Navigation'
import { setNavResize } from '../../../actions'

const mapStateToProps = (state)=>({
  pageAuth: state.userAuth.pageAuth
})

const mapDispatchToProps = (dispatch)=>({
  setNavResize: ()=>{dispatch(setNavResize())}
})


export default connect(mapStateToProps,mapDispatchToProps)(Navigation)
