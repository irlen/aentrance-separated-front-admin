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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 控件基类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author kyle(hinikai@gmail.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Control = function (_Component) {
    _inherits(Control, _Component);

    function Control(args) {
        _classCallCheck(this, Control);

        var _this = _possibleConstructorReturn(this, (Control.__proto__ || Object.getPrototypeOf(Control)).call(this, args));

        _this.state = {};
        return _this;
    }

    _createClass(Control, [{
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
            this.props.map.removeControl(this.control);
            this.control = null;
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var map = this.props.map;
            if (!map) {
                return;
            }

            this.destroy();
            this.control = this.getControl();
            map.addControl(this.control);
        }
    }, {
        key: 'getControl',
        value: function getControl() {
            return null;
        }
    }]);

    return Control;
}(_component2.default);

exports.default = Control;