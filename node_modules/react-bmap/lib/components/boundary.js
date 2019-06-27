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

var Boundary = function (_Component) {
    _inherits(Boundary, _Component);

    function Boundary(args) {
        _classCallCheck(this, Boundary);

        var _this = _possibleConstructorReturn(this, (Boundary.__proto__ || Object.getPrototypeOf(Boundary)).call(this, args));

        _this.state = {};
        return _this;
    }

    _createClass(Boundary, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            this.initialize();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._allRequest = {};
            this._backData = {};
            this.initialize();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.mapvLayer) {
                this.mapvLayer.destroy();
                this.mapvLayer = null;
            }
        }
    }, {
        key: 'getPointArrayByDataSetData',
        value: function getPointArrayByDataSetData(dataSetData) {
            var points = [];
            for (var i = 0; i < dataSetData.length; i++) {
                var coordinates = dataSetData[i].geometry.coordinates[0];
                coordinates.forEach(function (coordinate) {
                    points.push(new BMap.Point(coordinate[0], coordinate[1]));
                });
            }
            return points;
        }
    }, {
        key: 'getBoundaryData',
        value: function getBoundaryData() {
            var sell = this;
            var data = this.props.data;
            var map = this.props.map;

            if (!data) {
                return;
            }

            this._request = {};
            var self = this;
            var bdary = new BMap.Boundary();
            var dataSetData = [];

            function isAllComplete() {
                var flag = true;
                for (var key in self._request) {
                    if (!self._request[key]) {
                        flag = false;
                    }
                }

                if (flag) {
                    self.dataSet.set(dataSetData);
                    var points = self.getPointArrayByDataSetData(dataSetData);
                    if (points.length > 0 && self.props.autoViewport !== false) {
                        map.setViewport(points, self.props.viewportOptions);
                    }
                }
            }

            data.forEach(function (item, index) {
                self._request[item.name] = false;
                if (self._backData[item.name]) {
                    dataSetData = dataSetData.concat(self._backData[item.name]);
                    self._request[item.name] = true;
                }
            });

            isAllComplete();

            data.forEach(function (item, index) {
                if (self._request[item.name]) {
                    return;
                }

                if (self._allRequest[item.name]) {
                    return;
                } else {
                    self._allRequest[item.name] = true;
                }

                bdary.get(item.name, function (rs) {
                    //获取行政区域
                    var tmpData = [];
                    for (var i = 0; i < rs.boundaries.length; i++) {
                        var coordinates = [];
                        var path = rs.boundaries[i].split(';');
                        for (var j = 0; j < path.length; j++) {
                            coordinates.push(path[j].split(','));
                        }

                        tmpData.push({
                            geometry: {
                                type: 'Polygon',
                                coordinates: [coordinates]
                            },
                            count: item.count
                        });
                    }
                    self._backData[item.name] = tmpData;
                    dataSetData = dataSetData.concat(tmpData);
                    self._request[item.name] = true;
                    isAllComplete();
                });
            });
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var map = this.props.map;
            if (!map) {
                return;
            }

            if (!this.mapvLayer) {
                this.dataSet = new _mapv.DataSet([]);

                var options = this.props.layerOptions || {
                    gradient: {
                        0: 'yellow',
                        1: 'red'
                    },
                    max: 100,
                    globalAlpha: 0.8,
                    draw: 'intensity'
                };

                this.mapvLayer = new _mapv.baiduMapLayer(map, this.dataSet, options);
            }

            this.getBoundaryData();
        }
    }]);

    return Boundary;
}(_component2.default);

exports.default = Boundary;