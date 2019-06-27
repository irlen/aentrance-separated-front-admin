

const user = (state={userName:'',isVerificated:false},action)=>{
   switch(action.type){
    case 'USER_LOGIN':
      return Object.assign(state,action.userInfo)
    case 'USER_LOGOUT':
      return Object.assign(state,action.userInfo)
    default:
      return state
  }
}

export default user
