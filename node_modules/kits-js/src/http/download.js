/* eslint-disable */
/**
 * @file http
 */
/* globals XMLHttpRequest window location document*/
/**
 * get the data from url
 * auto use jsonp or ajax
 * @params 传入的参数
 * @params.url
 */
function fetch(params) {
    let fetchObj = null;
    if (/^http(s{0,1}):\/\//.test(params.url)) {
        const pageLoc = location.href.match(/^https{0,1}:\/\/(.+?)(?=\/|$)/);
        const ajaxLoc = params.url.match(/^https{0,1}:\/\/(.+?)(?=\/|$)/);
        if (pageLoc.length === 2 && ajaxLoc.length === 2 && ajaxLoc[1] === pageLoc[1]) {
            fetchObj = this.ajax(params);
        } else {
            fetchObj = this.jsonp(params);
        }
    } else {
        fetchObj = this.ajax(params);
    }
    return fetchObj;
}

/**
 * @params.method
 * @params.data
 * @params.url
 * @params.fail
 * @params.success
 */
function download(url, fileName) {
    var a = document.createElement('a');
    a.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([url]);
    a.href = URL.createObjectURL(blob);
    a.href = url;
    if (fileName) {
        a.download = fileName;
    }
    document.body.appendChild(a);
    // 触发点击
    a.click();
    // 然后移除
    document.body.removeChild(a);
    // var iframe  = document.createElement("iframe");
    // document.body.appendChild(iframe); 		
    // iframe.src = url;
    // iframe.style.display = "none";
}

export default download;