'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('./http.js');

var _http2 = _interopRequireDefault(_http);

var _download = require('./download.js');

var _download2 = _interopRequireDefault(_download);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_http2.default.download = _download2.default;

exports.default = _http2.default;