function isObj(obj) {
    return (typeof obj === 'object' || typeof obj === 'function') && obj !== null
}

// 深度克隆
function deepClone(obj, hash = new WeakMap()) {
    let cloneObj
    let Constructor = obj.constructor
    switch (Constructor) {
        case RegExp:
            cloneObj = new Constructor(obj)
            break
        case Date:
            cloneObj = new Constructor(obj.getTime())
            break
        default:
            if (hash.has(obj)) return hash.get(obj)
            cloneObj = new Constructor()
            hash.set(obj, cloneObj)
    }
    for (let key in obj) {
        cloneObj[key] = isObj(obj[key]) ? deepClone(obj[key], hash) : obj[key];
    }
    return cloneObj
}

// const deepClone = (obj) => {
//     var proto = Object.getPrototypeOf(obj);
//     return Object.assign({}, Object.create(proto), obj);

// }
export default deepClone;