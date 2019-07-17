

const nav = (state={collapsed: true,navWidth:'56px'},action)=>{
   switch(action.type){
    case 'UPDATE_INDUS':
      return Object.assign({},state,action.value)
    default:
      return state
  }
}

export default nav
