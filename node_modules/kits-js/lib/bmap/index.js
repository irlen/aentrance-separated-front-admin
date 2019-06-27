'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createPoint = require('./createPoint');

var _createPoint2 = _interopRequireDefault(_createPoint);

var _getPoints = require('./getPoints.js');

var _getPoints2 = _interopRequireDefault(_getPoints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bmap = {
    createPoint: _createPoint2.default,
    getPoints: _getPoints2.default
};
exports.default = bmap;