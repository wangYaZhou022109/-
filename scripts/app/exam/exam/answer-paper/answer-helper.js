var E = require('./app/exam/exam-websocket'),
    CryptoJS = require('crypto-js'),
    D = require('drizzlejs'),
    _ = require('lodash/collection'),
    IV = '1234567890123456',
    webSocket, timeout, switchScreen, decryptAnswer, closeListener,
    refreshParentWindow, removeCloseListener;

webSocket = {
    connect: function(examId, submitPaper, timeExpand) {
        E.connect(examId, {
            submitPaper: submitPaper,
            timeExpand: timeExpand
        });
    },
    closeConnect: function() {
        E.disconnect();
    }
};

timeout = {
    cancel: function() {
        clearTimeout(this.timeOutId);
        delete this.timeOutId;
        return;
    },
    timeOutId: -1
};

switchScreen = function(exam) {
    var me = this,
        isAllowSwitch = exam.isAllowSwitch;
    if (isAllowSwitch && isAllowSwitch === 1) {
        document.addEventListener('visibilitychange', function() {
            if (exam.visibilityState === 'hidden' && document.visibilityState === 'visible') {
                D.assign(exam, { visibilityState: 'visible' });
                return me.dispatch('lowerSwitchTimes');
            }
            D.assign(exam, { visibilityState: 'hidden' });
            return true;
        });
    }
};

closeListener = function() {
    window.addEventListener('beforeunload', function() {
        return 'aa';
    });
};

removeCloseListener = function() {
    window.removeEventListener('beforeunload', function() {
        return 'aa';
    });
};

decryptAnswer = function(v, k) {
    var hex = CryptoJS.enc.Hex.parse(v),
        base64Str = CryptoJS.enc.Base64.stringify(hex),
        decrypted = CryptoJS.AES.decrypt(base64Str, CryptoJS.enc.Utf8.parse(k), {
            iv: CryptoJS.enc.Utf8.parse(IV),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }),
        value = CryptoJS.enc.Utf8.stringify(decrypted).toString();
    return value;
};

/* eslint-disable no-underscore-dangle */
refreshParentWindow = function() {
    var parent = window.opener && window.opener.app,
        mod;
    if (parent) {
        _.forEach(parent._modules, function(v, k) {
            if (k.indexOf('center/exam') > -1) mod = v;
        });
        if (mod) {
            return mod.dispatch('selectItem');
        }
    }
    return '';
};

module.exports = {
    WS: webSocket,
    TO: timeout,
    switchScreen: switchScreen,
    decryptAnswer: decryptAnswer,
    closeListener: closeListener,
    refreshParentWindow: refreshParentWindow,
    removeCloseListener: removeCloseListener
};
