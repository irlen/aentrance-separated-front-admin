import { combineReducers } from 'redux'
import nav from './nav'
import homeview from './homeview'
import windowH from './windowH'
export default combineReducers({
  homeview,
  nav,
  windowH
})
