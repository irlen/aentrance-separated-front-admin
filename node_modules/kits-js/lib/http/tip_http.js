'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('./http.js');

var _http2 = _interopRequireDefault(_http);

var _error_tip = require('./error_tip/error_tip.js');

var _error_tip2 = _interopRequireDefault(_error_tip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var dialog = new Dialog({
//     text: '...'
// });

/* eslint-disable */
var http = {
    fetch: function fetch(obj) {
        // hijacking the success function 
        var _obj = {};
        for (var i in obj) {
            if (i == 'success') {
                _obj[i] = function (data) {
                    obj[i](data);
                };
            } else {
                _obj[i] = obj[i];
            }
        };

        _http2.default.fetch(_obj);
    },
    ajax: function ajax() {
        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
            arg[_key] = arguments[_key];
        }

        var success = arg[0].success;
        arg[0].success = function (data) {
            if (data.status !== 0) {
                _error_tip2.default.showError(data.message);
            } else {
                success(data);
            }
        };
        _http2.default.ajax.apply(this, arg);
    },
    jsonp: function jsonp() {
        for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            arg[_key2] = arguments[_key2];
        }

        var success = arg[0].success;
        arg[0].success = function (data) {
            if (data.status !== 0) {
                _error_tip2.default.showError(data.message);
            } else {
                success(data);
            }
        };
        _http2.default.jsonp.apply(this, arg);
    }
};
// import Dialog from './dialog.js';
exports.default = http;