var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    state: true,
    cla: true,
    allA: true,
    allB: true
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
    }
};
