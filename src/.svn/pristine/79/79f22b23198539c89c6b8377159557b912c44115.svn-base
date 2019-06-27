//单个ip
const singleIp = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/ ;
//const rangeIp = /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\-((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/;

//ip段
const groupIp = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\/([8-9]|[1-2]\d|3[0-1])$/ ;

//ip范围
const rangeIp = (str)=>{
  const rangeIpRex = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\-((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
  let canBe = true
  if(!rangeIpRex.test(str)){
    canBe = false
  }else{
    const index = str.search(/\-/)
    const ipone = str.substring(0,index)
    const iptwo = str.substring(index+1)
    const iponeArray = ipone.split(".")
    const iptwoArray = iptwo.split(".")
    const iponeCount = parseInt(iponeArray[0],0)*1000000000000+parseInt(iponeArray[1],0)*1000000000+parseInt(iponeArray[2],0)*1000000+parseInt(iponeArray[3],0)*1000;
    const iptwoCount = parseInt(iptwoArray[0],0)*1000000000000+parseInt(iptwoArray[1],0)*1000000000+parseInt(iptwoArray[2],0)*1000000+parseInt(iptwoArray[3],0)*1000;
    if(iponeCount>iptwoCount){
      canBe = false
    }
  }
  return canBe
}

//单个端口
const singlePort = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

//端口范围
//const rangePort = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])-([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
const rangePort = (str)=>{
  const rangePortRex = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])-([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  let canBe = true
  if(!rangePortRex.test(str)){
    canBe = false
  }else{
    const index = str.search(/\-/)
    const portone = str.substring(0,index)
    const porttwo = str.substring(index+1)
    if(portone>porttwo){
      canBe = false
    }
  }
  return canBe
}
//正数（包括浮点型）
const forNumber = /^[0-9]\.\d+$|^[1-9]+\.\d+$|^[1-9][0-9]*$/

//名称相关
const forName = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/

//邮箱
const forEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
//域名
const domainName = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/


export { singleIp, rangeIp, groupIp, singlePort, forName, forNumber, rangePort, forEmail, domainName }
