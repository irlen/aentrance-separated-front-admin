const ip_addr = document.location.hostname;

const host  = 'http://'+ip_addr+':8080/NetLog/public/?r='


exports.host =  host
exports.singleHost = ip_addr
