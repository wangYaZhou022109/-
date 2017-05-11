var _ = require('lodash/collection');
exports.title = '班车餐饮信息统计';
exports.bindings = {
    bus: true
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
    sectionDisplay: function(data) {
        _.map(data.bus || [], function(bus) {
            var e = bus;
            console.log(e);
        });
        return data.bus;
    }
};
