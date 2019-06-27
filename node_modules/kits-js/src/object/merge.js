const merge = function (tar, source) {
    const merge = (origin, modifys) => {
        for (var k in modifys) {
            if (Object.prototype.toString.call(modifys[k]) == '[object Object]') {
                if (typeof (origin[k]) !== 'object') {
                    origin[k] = {}
                }
                merge(origin[k], modifys[k])
            } else {
                origin[k] = modifys[k];
            }
        }
    }
    let cp = JSON.parse(JSON.stringify(tar));
    merge(cp, source)
    return cp;
}
export default merge;