import { connect } from 'react-redux'
import ModalType from './ModalType'
import { setData } from '../actions'
const mapStateToProps  = (state)=>({
  modules: state.homeview.modules,
  id: state.homeview.id
})
const mapDispatchToProps = (dispatch)=>({
  doSetData: (dataInfo)=>{
    dispatch(setData(dataInfo))
  }
})
export default connect(mapStateToProps,mapDispatchToProps)(ModalType)
