'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 
 * @param {*} pt 
 * pt demo1: '114.54,40.33'
 * pt demo2: [114.54,40.33]
 * pt demo3: {lng:114.54,lat:40.33}
 */
var createBmapPoint = function createBmapPoint(pt) {
    var onlyData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var lng = void 0;
    var lat = void 0;
    try {
        if (typeof pt === 'string') {
            var lnglatstrArr = pt.split(',');
            lng = JSON.parse(lnglatstrArr[0].match(/[0-9]+\.?[0-9]{0,}/)[0]);
            lat = JSON.parse(lnglatstrArr[1].match(/[0-9]+\.?[0-9]{0,}/)[0]);
        } else if (pt instanceof Array) {
            lng = JSON.parse(pt[0]);
            lat = JSON.parse(pt[1]);
        } else if (pt instanceof Object) {
            lng = pt.lng;
            lat = pt.lat;
        }
        if (onlyData) {
            return {
                lng: lng,
                lat: lat
            };
        } else {
            var mpoint = new BMap.Point(lng, lat);
            return mpoint;
        }
    } catch (error) {
        console.log('create BmapPoint error', 'Please input data like this:  1. "114.54,40.33",  2.[114.54,40.33],  3.{lng:114.54,lat:40.33}');
    }
};
exports.default = createBmapPoint;