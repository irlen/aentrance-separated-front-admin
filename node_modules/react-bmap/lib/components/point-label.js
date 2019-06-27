'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _DraggingTip = require('../overlay/DraggingTip');

var _DraggingTip2 = _interopRequireDefault(_DraggingTip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 文本标注组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var App = function (_Component) {
    _inherits(App, _Component);

    function App(args) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, args));

        _this.state = {};
        _this.tips = [];
        return _this;
    }

    /**
     * 设置默认的props属性
     */


    _createClass(App, [{
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
            this.tips.forEach(function (tip) {
                tip.hide();
            });
            this.tips = [];
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this2 = this;

            var map = this.props.map;
            if (!map) {
                return;
            }

            this.destroy();

            if (this.props.data) {
                var points = [];
                this.props.data.forEach(function (item, index) {
                    var tip = new _DraggingTip2.default({
                        isShowTipArrow: true,
                        changePosition: function changePosition(point) {
                            _this2.props.changePosition && _this2.props.changePosition(point, index);
                        },
                        map: map,
                        numberDirection: item.numberDirection,
                        isShowNumber: item.isShowNumber,
                        point: item.point,
                        name: item.name,
                        index: item.index !== undefined ? item.index : index + 1,
                        color: item.color,
                        change: function change() {}
                    });
                    points.push(item.point);
                    tip.show();
                    _this2.tips.push(tip);
                });

                if (this.props.autoViewport) {
                    map.setViewport(points, this.props.viewportOptions);
                }
            }
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {};
        }
    }]);

    return App;
}(_component2.default);

exports.default = App;