import _ from 'lodash'
const homeview = (state={modules: [],id:''},action)=>{
   switch(action.type){
    case 'ADD_MODULE':
      const newModules = state.modules?_.cloneDeep(state.modules):[]
       newModules.push(action.moduleData)
      return Object.assign({},state,{modules:newModules})
    case 'SET_POSITION':
      const newPosition = _.cloneDeep(state.modules)
      newPosition.map((item,index)=>{
        action.positions.map((subItem,subIndex)=>{
          if(item.id === subItem.i){
            const {h,w,x,y} = subItem
            newPosition[index].position = Object.assign({},newPosition[index].position,{h,w,x,y})
            return
          }
        })
      })
      return  Object.assign({},state,{modules:newPosition})
    case 'DELETE_MODULE':
      const deletedModules = _.cloneDeep(state.modules)
      state.modules.map((item,index)=>{
        if(item.id === action.id){
          deletedModules.splice(index,1)
          return
        }
      })
      return  Object.assign({},state,{modules:deletedModules})
    case 'SET_DATA':
      const setModules = _.cloneDeep(state.modules)
      setModules.map((item,index)=>{
        if(item.id === action.dataInfo.setId){
          setModules[index].data = Object.assign({},item.data,action.dataInfo)
        }
      })
      return  Object.assign({},state,{modules:setModules})
    case 'INIT_MODULES':
      return {modules: action.modulesData.modules,id: action.modulesData.id}
    default:
      return state
  }
}

export default homeview
