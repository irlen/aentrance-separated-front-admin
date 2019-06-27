'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createPoint = require('./createPoint.js');

var _createPoint2 = _interopRequireDefault(_createPoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPoints = function getPoints(border) {
    var originalData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var polygons = [];
    var borders = border.split('|');

    borders.forEach(function (border) {
        var arr = border ? border.split(',') : [];
        var objArr = [];
        var i = 0;
        while (i < arr.length - 1) {
            var obj = {
                lng: parseFloat(arr[i]),
                lat: parseFloat(arr[i + 1])
            };
            if (originalData) {
                objArr.push(obj);
            } else {
                var bPoint = (0, _createPoint2.default)(obj);
                objArr.push(bPoint);
            }
            i += 2;
        }
        polygons.push(objArr);
    });
    if (polygons.length == 1) {
        polygons = polygons[0];
    }
    return polygons;
}; /**
    * src support multi data types
    * 1. multi points array seperated by |
    *  "114.33,40.22,114.33,40.22,114.33,40.22|114.33,40.22,114.33,40.22,114.33,40.22"
    * 2. just like: 'lng,lat,lnt,lat,lnt,lat,lnt,lat'
    *  "114.33,40.22,114.33,40.22,114.33,40.22"
    */
exports.default = getPoints;