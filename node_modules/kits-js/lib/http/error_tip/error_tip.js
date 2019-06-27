'use strict';

/* eslint-disable */
require('./error_tip.scss');

function ErrorTip() {
    var div = this.div = document.createElement('div');
    div.setAttribute('class', 'error-tip-container');
    div.style.display = 'none';
    var messageDiv = this.messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'error-message');
    div.appendChild(messageDiv);
    document.body.appendChild(div);
}
ErrorTip.prototype.showError = function (message) {
    var self = this;
    clearInterval(self.timeout);
    self.div.style.display = 'block';
    self.messageDiv.innerHTML = message;
    self.timeout = setTimeout(function () {
        self.hide();
    }, 5000);
};
ErrorTip.prototype.hide = function () {
    var self = this;
    clearInterval(self.timeout);
    self.div.style.display = 'none';
};
var instance = new ErrorTip();
module.exports = instance;