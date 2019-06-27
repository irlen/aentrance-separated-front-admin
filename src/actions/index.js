import _ from 'lodash'
import { wyAxiosPost } from '../components/WyAxios'


export const doToggle = (collapsed)=>({
  type: 'DO_TOGGLE',
  collapsed
})
//增加模块
export const addModules = (moduleData)=>({
  type: 'ADD_MODULE',
  moduleData
})
//设置位置
export const setPosition = (positions)=>({
  type: 'SET_POSITION',
  positions
})
//删除模块
export const deleteModule = (id)=>({
  type: 'DELETE_MODULE',
  id
})

//初始化modules
export const initModules = (modulesData)=>({
  type: 'INIT_MODULES',
  modulesData
})

//设置数据
export const setData = (dataInfo)=>({
  type: 'SET_DATA',
  dataInfo
})

//设置windowH
export const setWindowH = (windowH)=>({
  type:'SET_WH',
  windowH
})
