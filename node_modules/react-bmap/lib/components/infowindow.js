'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 信息窗口组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Infowindow = function (_Component) {
    _inherits(Infowindow, _Component);

    function Infowindow(args) {
        _classCallCheck(this, Infowindow);

        var _this = _possibleConstructorReturn(this, (Infowindow.__proto__ || Object.getPrototypeOf(Infowindow)).call(this, args));

        _this.state = {};
        return _this;
    }

    _createClass(Infowindow, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            this.initialize();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroy();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.props.map.closeInfoWindow();
            this.infoWindow = null;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var map = this.props.map;
            if (!map) {
                return;
            }

            this.destroy();

            var opts = {};
            this.infoWindow = new BMap.InfoWindow(this.props.text, this.getOptions(this.options)); // 创建信息窗口对象 
            this.bindEvent(this.infoWindow, this.events);
            map.openInfoWindow(this.infoWindow, new BMap.Point(this.props.position.lng, this.props.position.lat)); //开启信息窗口
        }
    }, {
        key: 'options',
        get: function get() {
            return ['width', 'height', 'maxWidth', 'offset', 'title', 'enableAutoPan', 'enableCloseOnClick', 'enableMessage', 'message'];
        }
    }, {
        key: 'events',
        get: function get() {
            return ['close', 'open', 'maximize', 'restore', 'clickclose'];
        }
    }]);

    return Infowindow;
}(_component2.default);

exports.default = Infowindow;