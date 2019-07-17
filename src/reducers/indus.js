

const indus = (state={one:[],two:[],three:[],four:[],five:[],six:[]},action)=>{
   switch(action.type){
    case 'UPDATE_INDUS':
    console.log(action.value)
      return Object.assign({},state,action.value)
    default:
      return state
  }
}

export default indus
