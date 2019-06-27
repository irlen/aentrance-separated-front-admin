'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _mapv = require('mapv');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
    _inherits(App, _Component);

    function App(args) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, args));

        _this.state = {};
        return _this;
    }

    _createClass(App, [{
        key: 'handleClick',
        value: function handleClick(id) {
            this.props.onClick && this.props.onClick(id);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            var preData = JSON.stringify(prevProps.data);
            var data = JSON.stringify(this.props.data);
            if (preData != data || !this.map) {
                this.initialize();
            }
        }
    }, {
        key: 'initialize',
        value: function initialize() {

            var self = this;
            var map = this.props.map;
            if (!map) {
                return;
            }
            this.map = map;

            if (!this._createLayer) {
                this.createLayers();
            }

            this.showDatasets(this.props.data);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {

            this.shadowSet = null;
            this.circleSet = null;
            this.textSet = null;
            this.numSet = null;
            this.otherSet = null;
            this.otherShadowSet = null;

            for (var i = 0; i < this.layers.length; i++) {
                this.layers[i].destroy();
                this.layers[i] = null;
            }
        }
    }, {
        key: 'showDatasets',
        value: function showDatasets(list) {
            var _this2 = this;

            var shadowData = [];
            var circleData = [];
            var textData = [];
            var otherData = [];
            var otherShadowData = [];
            var overViews = [];

            if (list.length > 0) {

                list.forEach(function (item, key) {
                    var cityCenter = item['location'].split(',');
                    var p = _this2.project.pointToLngLat(new BMap.Pixel(cityCenter[0], cityCenter[1]));
                    overViews.push(p);
                    if (key < 10) {
                        shadowData.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter[0], cityCenter[1]]
                            },
                            count: parseInt(item['count'])
                        });
                        circleData.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter[0], cityCenter[1]]
                            },
                            id: key,
                            count: parseInt(item['count']),
                            text: parseInt(key) + 1
                        });
                        textData.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter[0], cityCenter[1]]
                            },
                            count: parseInt(item['count']),
                            text: item['text']
                        });
                    } else {
                        otherData.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter[0], cityCenter[1]]
                            },
                            id: key,
                            count: parseInt(item['count'])
                        });
                        otherShadowData.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter[0], cityCenter[1]]
                            },
                            count: parseInt(item['count'])
                        });
                    }
                });
                this.shadowSet.set(shadowData);
                this.circleSet.set(circleData);
                this.textSet.set(textData);
                this.numSet.set(circleData);
                this.otherSet.set(otherData);
                this.otherShadowSet.set(otherShadowData);
                if (overViews.length > 0 && this.props.autoViewport !== false) {
                    map.setViewport(overViews, self.props.viewportOptions);
                }
            }
        }
    }, {
        key: 'createLayers',
        value: function createLayers() {
            this._createLayer = true;
            var map = this.map;
            this.project = map.getMapType().getProjection();

            var self = this;
            var shadowSet = this.shadowSet = new _mapv.DataSet([]);
            var circleSet = this.circleSet = new _mapv.DataSet([]);
            var textSet = this.textSet = new _mapv.DataSet([]);
            var numSet = this.numSet = new _mapv.DataSet([]);
            var otherSet = this.otherSet = new _mapv.DataSet([]);
            var otherShadowSet = this.otherShadowSet = new _mapv.DataSet([]);
            this.layers = [];

            var otherOptions = {
                coordType: 'bd09mc',
                splitList: {
                    4: '#d53938',
                    3: '#fe6261',
                    2: '#ffb02d',
                    other: '#80db69'
                },
                shadowBlur: 10,
                size: 5,
                max: 30,
                methods: {
                    click: function click(item) {
                        if (item) {
                            self.handleClick(item.id);
                        }
                    },
                    mousemove: function mousemove(item) {
                        otherSet.update(function (item) {
                            item.fillStyle = null;
                        });
                        if (item) {
                            self.isSmallPath = true;
                            self.props.map.setDefaultCursor('pointer');
                            otherSet.update(function (item) {
                                item.fillStyle = '#1495ff';
                            }, {
                                id: item.id
                            });
                        } else {
                            self.isSmallPath = false;
                            if (!self.isSmallPath && !self.isBigPath) {
                                self.props.map.setDefaultCursor('auto');
                            }
                        }
                    }

                },
                draw: 'category'
            };

            var otherShadowOptions = {
                splitList: {
                    4: '#d53938',
                    3: '#fe6261',
                    2: '#ffb02d',
                    1: '#80db69'
                },
                styleType: 'fill',
                globalAlpha: 0.4,
                coordType: 'bd09mc',
                size: 8,
                minSize: 5,
                draw: 'category'
            };
            this.layers.push(new _mapv.baiduMapLayer(map, otherShadowSet, otherShadowOptions));

            this.layers.push(new _mapv.baiduMapLayer(map, otherSet, otherOptions));

            if (this.props.animation === true) {
                var shadowOptions = {
                    splitList: {
                        4: '#d53938',
                        3: '#fe6261',
                        2: '#ffb02d',
                        1: '#80db69'
                    },
                    styleType: 'stroke',
                    globalAlpha: 0.4,
                    coordType: 'bd09mc',
                    size: 20,
                    minSize: 10,
                    draw: 'category'
                };
                this.layers.push(new _mapv.baiduMapAnimationLayer(map, shadowSet, shadowOptions));
            }

            var circleOptions = {
                splitList: {
                    1: '#80db69',
                    4: '#d53938',
                    3: '#fe6261',
                    2: '#ffb02d'
                },
                fillStyle: 'red',
                coordType: 'bd09mc',
                size: 10,
                draw: 'category',
                methods: {
                    click: function click(item) {
                        if (item) {
                            self.handleClick(item.id);
                        }
                    },
                    mousemove: function mousemove(item) {
                        circleSet.update(function (item) {
                            item.fillStyle = null;
                        });
                        if (item) {
                            self.isBigPath = true;
                            self.map.setDefaultCursor('pointer');
                            circleSet.update(function (item) {
                                item.fillStyle = '#1495ff';
                            }, {
                                id: item.id
                            });
                        } else {
                            self.isBigPath = false;
                            if (!self.isBigPath && !self.isSmallPath) {
                                self.map.setDefaultCursor('auto');
                            }
                        }
                    }
                }
            };
            this.layers.push(new _mapv.baiduMapLayer(map, circleSet, circleOptions));

            var numOptions = {
                coordType: 'bd09mc',
                draw: 'text',
                font: '13px Arial',
                fillStyle: '#ffffff',
                shadowColor: '#ffffff',
                shadowBlur: 10
            };
            this.layers.push(new _mapv.baiduMapLayer(map, numSet, numOptions));

            var textOptions = {
                coordType: 'bd09mc',
                font: '13px Arial',
                fillStyle: '#666',
                shadowColor: '#ffffff',
                shadowBlur: 10,

                draw: 'text',
                avoid: true,
                textAlign: 'left',
                offset: {
                    x: 10,
                    y: 0
                }
            };
            this.layers.push(new _mapv.baiduMapLayer(map, textSet, textOptions));
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }], [{
        key: 'defaultProps',
        get: function get() {
            return {
                autoViewport: true
            };
        }
    }]);

    return App;
}(_component2.default);

exports.default = App;