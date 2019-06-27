'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _deepClone = require('./deepClone.js');

var _deepClone2 = _interopRequireDefault(_deepClone);

var _merge = require('./merge.js');

var _merge2 = _interopRequireDefault(_merge);

var _diff = require('./diff.js');

var _diff2 = _interopRequireDefault(_diff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extend = {
    deepClone: _deepClone2.default,
    merge: _merge2.default,
    diff: _diff2.default
};
exports.default = extend;