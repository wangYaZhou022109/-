var _ = require('lodash/collection');

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'wei' }
}];

exports.title = '选择维度';

exports.bindings = {
    wei: true,
    state: false
};

exports.events = {
    'click check-all': 'checkAll',
    'click check-item*': 'checkItem'
};

exports.handlers = {
    checkAll: function(events, obj) {
        var wei = this.bindings.wei.data,
            state = [],
            me = this;
        this.bindings.state.clear();
        this.$$('input[name="conId"]').forEach(function(x) {
            var element = x || {};
            element.checked = obj.checked;
        });
        wei.forEach(function(e) {
            if (obj.checked) {
                state.push({ id: e.id, name: e.name });
            }
        });
        me.bindings.state.changed();
        this.bindings.state.data = state;
    },
    checkItem: function(value, e, ele) {
        var data = this.bindings.state.data,
            id = value,
            i = 0,
            weiName = ele.getAttribute('weiName');
        if (ele.checked) {
            data.push({ id: id, name: weiName });
        } else {
            for (i; i < data.length; i++) {
                if (data[i].id === id) {
                    data.splice(i, 1);
                    break;
                }
            }
        }
    }
};

exports.dataForTemplate = {
    wei: function(data) {
        var pageNum = this.bindings.wei.getPageInfo().page;
        _.map(data.wei || [], function(project, i) {
            var e = project;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return data.wei;
    },
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
