/* eslint-disable */
import Http from './http.js';
// import Dialog from './dialog.js';
import errorTip from './error_tip/error_tip.js';

// var dialog = new Dialog({
//     text: '...'
// });

var http = {

    fetch(obj) {
        // hijacking the success function 
        var _obj = {};
        for (var i in obj) {
            if (i == 'success') {
                _obj[i] = function (data) {
                    obj[i](data);
                }
            } else {
                _obj[i] = obj[i];
            }
        };

        Http.fetch(_obj);
    },
    ajax(...arg) {
        const success = arg[0].success;
        arg[0].success = data => {
            if (data.status !== 0) {
                errorTip.showError(data.message);
            } else {
                success(data);
            }
        };
        Http.ajax.apply(this, arg);
    },
    jsonp(...arg) {
        const success = arg[0].success;
        arg[0].success = data => {
            if (data.status !== 0) {
                errorTip.showError(data.message);
            } else {
                success(data);
            }
        };
        Http.jsonp.apply(this, arg);
    }
};

export default http;