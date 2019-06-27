

const userAuth = (state={},action)=>{
   switch(action.type){
    case 'SET_USERAUTH':
      return  action.authData
    default:
      return state
  }
}

export default userAuth
