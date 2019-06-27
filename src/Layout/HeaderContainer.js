import { connect } from 'react-redux'
import Header from './Header'
const mapStateToProps = (state)=>({
  navWidth: state.nav.navWidth
})

export default connect(mapStateToProps)(Header)
