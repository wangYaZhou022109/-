var _ = require('lodash/collection');

exports.title = '班车餐饮信息统计';
exports.bindings = {
    bus: true,
    state: false
};
exports.events = {
    'click sectionDisplay-*': 'sectionDisplay',
    'click check-item*': 'checkItem'
};

exports.handlers = {
    sectionDisplay: function(id) {
        this.module.dispatch('sectionDisplay', id);
    },
    checkItem: function(id, e) {
        var flag = e.target.checked;
        var me = this;
        if (flag === true) {
            this.module.dispatch('detailInsert', id).then(function() {
                me.app.message.success('保存成功');
            });
        } else {
            this.module.dispatch('detaildelete', id).then(function() {
                me.app.message.success('删除成功');
            });
        }
    }
};

exports.dataForTemplate = {
    bus: function() {
        var bus = this.bindings.bus.data;
        var state = this.bindings.state.data || {};
        _.map(bus || {}, function(b) {
            var s = b,
                optionList = s.optionList;
            _.map(optionList, function(o) {
                var p = o;
                if (state.traineeId) {
                    p.isGrant = true;
                } else {
                    p.isGrant = false;
                }
                return p;
            });
            s.optionList = optionList;
            return s;
        });
        return bus;
    }
};
