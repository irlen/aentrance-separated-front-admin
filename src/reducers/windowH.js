

const windowH = (state={windowH: ''},action)=>{
   switch(action.type){
    case 'SET_WH':
      return {windowH:action.windowH}
    default:
      return state
  }
}

export default windowH
