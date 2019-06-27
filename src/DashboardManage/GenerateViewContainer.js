import { connect } from 'react-redux'
import GenerateView from './GenerateView'
import { setPosition, deleteModule, setData } from '../actions'
const mapStateToProps  = (state)=>({
  id: state.homeview.id,
  modules: state.homeview.modules
})
const mapDispatchToProps = (dispatch)=>({
  doSetPosition : (positions)=>{
    dispatch(setPosition(positions))
  },
  doDeleteModule: (id)=>{
    dispatch(deleteModule(id))
  },
  doSetData: (dataInfo)=>{
    dispatch(setData(dataInfo))
  }
})
export default connect(mapStateToProps,mapDispatchToProps)(GenerateView)
