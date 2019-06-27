import _ from 'lodash'

//生成正则
const isFloat  = (n)=>{
  return n===+n && n!==(n|0);
}
const decodeStr = (before,instr,after, name, isEnd)=>{
  if(before && after && !before['selected'] && !after['selected']){
	  var bl = before['str'][before['str'].length-1] //取之前最后一个值
	  var as = after['str'][0]	//取之后第一个值
	  if (bl === "'" && as === "'"){
		  return "(?<"+name+">(?<=\\').*?(?=\\'))"
	  }
	  else if (bl === '"' && as === '"'){
		  return '(?<'+name+'>(?<=\\").*?(?=\\"))'
	  }
	  else if (bl === '[' && as === ']'){

		  return "(?<"+name+">(?<=\\[).*?(?=\\]))"
	  }
	  else if (bl === '{' && as === '}'){
		  return "(?<"+name+">(?<=\\{).*?(?=\\}))"
	  }
	  else if (bl === '(' && as === ')'){
		  return "(?<"+name+">(?<=\\().*?(?=\\)))"
	  }
  }
  var _str = instr.split(' ')
  if (isEnd && _str.length > 1){
	  return "(?<"+name+">.+)"
  }
  
  var _s = instr
  _str.forEach((s,i)=>{
    //判断是否为数字
    if (Number(s)){
      //判断是否为浮点数
      if(isFloat(Number(s))){
        _s = _s.replace(s, "[-+]?(\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?",1)
      }else{
        _s = _s.replace(s,"[-+]?\\d+",1)
      }
    }else{
      _s = _s.replace(s,"\\S+",1)
    }
  })
  var r = '(?<'+name+'>'+_s+')'
  return r
}
const decodeChar = (instr)=>{
  var r = instr
  
  var _str = r.split(' ')
  _str.forEach((s, i)=>{
    if (s.length > 1){
		if(s[s.length-1] === ':' ){
			var p = '(.+?:)'
			r = r.replace(s,p,1)
		}
		else if (s[s.length-1] === '='){
			var p = '(.+?=)'
			r = r.replace(s,p,1)
		}	
		else{
			var p= '\\S{'+s.length+'}'
			r = r.replace(s,p,1)
		}
    }
  })
 
  // r = r.replace('(','\\(')
  // r = r.replace(')','\\)')
  // r = r.replace('{','\\{')
  // r = r.replace('}','\\}')
  r = r.replace('[','\\[')
  r = r.replace(']','\\]')
  r = r.replace('"','\\"')
  r = r.replace("'","\\'")
  
  return r
}
const decodeArr = (instr, source)=>{
  var p = ''
  var t = _.cloneDeep(instr)
  var before=null
  var after=null
  var end = t.pop()	//获取最后一个值并移除
  
  for (var i=0; i < t.length; i++){
	  //判断i 不为第一个
	  if (i !== 0){
		  before = t[i-1]
	  }
	  //判断i不为最后一个
	  if(i !== t.length - 1){
		  after = t[i+1]
	  }else
	  {
		  after = end
	  }

	  if (t[i]['selected']){
		  var isEnd = false
		  if (t[i]['end'] == source.length){
			  isEnd = true
		  }
		  p += decodeStr(before, t[i]['str'],after ,t[i]['name'], isEnd)
	  }else{
		  p += decodeChar(t[i]['str'])
	  }

	  before=null
	  after=null
  }

  //判断最后一个是否是截取的
  if(end['selected']){
	p += decodeStr(end['str'], end['name'])
  }else{
	  //不是截取的 取一个字符
	  if(end['str'].length>=1){
		  var s = end['str'][0]
		  p += decodeChar(s)
	  }
  }

  return p
}
export default decodeArr
