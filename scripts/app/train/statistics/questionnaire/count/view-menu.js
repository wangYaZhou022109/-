var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    state: true,
    cla: true,
    allA: true,
    allB: true,
    all: true,
    downloadA: true,
    downloadC: true,
    downloadZ: true
};

exports.events = {
    'click menu-*': 'showMenu'
};

exports.handlers = {
    showMenu: function(menu) {
        var cla = this.bindings.cla;
        var state = this.bindings.state;
        state.data = {};
        state.data.classId = cla.data.id;
        state.data.menu = menu || 'news';
        state.data[menu] = true;
        state.changed();
    }
};

exports.dataForTemplate = {
    result: function(data) {
        var result = {},
            reA = data.allA,
            reB = data.allB,
            fenZ = 0,
            fenK = 0;
        if (reA.length >= 1) {
            _.forEach(reA, function(value) {
                var obj = value;
                fenZ += obj.manZF;
            });
        }
        if (reB.length >= 1) {
            _.forEach(reB, function(value) {
                var obj = value;
                fenK += obj.manZF;
            });
        }
        result.zong = (fenZ / reA.length).toFixed(2);
        result.ke = (fenK / reB.length).toFixed(2);
        result.ping = (((fenZ / reA.length) + (fenK / reB.length)) / 2).toFixed(2);
        return result;
    },
    exportUrl: function() {
        var urlA = this.bindings.downloadA.getFullUrl() + '?';
        var urlC = this.bindings.downloadC.getFullUrl() + '?';
        var urlZ = this.bindings.downloadZ.getFullUrl() + '?';
        var params = this.bindings.allA.params;
        var state = this.bindings.state.data;
        var token = this.app.global.OAuth.token.access_token;
        if (state.menu === 'news') {
            params.classId = this.bindings.state.data.classId;
            _.map(params, function(v, k) {
                urlA += (k + '=' + v + '&');
            });
            urlA += ('access_token=' + token);
            return urlA;
        }
        if (state.menu === 'exp') {
            params.classId = this.bindings.state.data.classId;
            _.map(params, function(v, k) {
                urlC += (k + '=' + v + '&');
            });
            urlC += ('access_token=' + token);
            return urlC;
        }
        if (state.menu === 'reply') {
            urlZ += ('access_token=' + token);
            return urlZ;
        }
        return null;
    },
    isManage: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'manage') {
            return true;
        }
        return false;
    },
    isFmtrainee: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'fmtrainee') {
            return true;
        }
        return false;
    },
    isClassstaff: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'classstaff') {
            return true;
        }
        return false;
    }
};
