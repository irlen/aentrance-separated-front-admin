'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 基础组件对象
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var App = function (_Component) {
    _inherits(App, _Component);

    function App(args) {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, args));
    }

    /**
     * 给某个对象绑定对应需要的事件
     * @param 需要绑定事件的对象
     * @param 事件名数组
     * @return null;
     */


    _createClass(App, [{
        key: 'bindEvent',
        value: function bindEvent(obj, events) {
            var self = this;
            if (events) {
                events.forEach(function (event) {
                    obj.addEventListener(event, function () {
                        self.props.events && self.props.events[event] && self.props.events[event].apply(self, arguments);
                    });
                });
            }
        }

        /**
         * 给某个对象绑定需要切换的属性对应的方法
         * @param 需要绑定属性的对象
         * @param 属性和对应的2个切换方法
         * @return null;
         */

    }, {
        key: 'bindToggleMeghods',
        value: function bindToggleMeghods(obj, toggleMethods) {
            for (var key in toggleMethods) {
                if (this.props[key] !== undefined) {
                    if (this.props[key]) {
                        obj[toggleMethods[key][0]]();
                    } else {
                        obj[toggleMethods[key][1]]();
                    }
                }
            }
        }
    }, {
        key: 'getOptions',
        value: function getOptions(options) {
            var _this2 = this;

            var result = {};
            options.map(function (key) {
                if (_this2.props[key] !== undefined) {
                    result[key] = _this2.props[key];
                }
            });
            return result;
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }]);

    return App;
}(_react.Component);

exports.default = App;