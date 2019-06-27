

const nav = (state={collapsed: true,navWidth:'56px'},action)=>{
   switch(action.type){
    case 'DO_TOGGLE':
      return {collapsed: action.collapsed, navWidth: action.collapsed?'56px':'160px'}
    default:
      return state
  }
}

export default nav
