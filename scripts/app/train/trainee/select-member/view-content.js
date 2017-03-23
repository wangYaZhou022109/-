var _ = require('lodash/collection');

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'members' }
}];

exports.title = '选择用户';

exports.bindings = {
    members: true,
    state: true
};

exports.events = {
    'click select_*': 'checkMember'
};

exports.handlers = {
    checkMember: function(value, e, ele) {
        var data = this.bindings.state.data,
            id = value,
            i = 0;
        if (ele.checked) {
            data.push(id);
        } else {
            for (i; i < data.length; i++) {
                if (data[i] === id) {
                    data.splice(i, 1);
                    break;
                }
            }
        }
    }
};

exports.dataForTemplate = {
    members: function(data) {
        var ids = this.bindings.state.data;
        var memberIds = this.module.renderOptions.memberIds;
        _.map(data.members || [], function(x) {
            var m = x || {};
            if (ids.indexOf(m.id) !== -1 || memberIds.indexOf(m.id) !== -1) m.checked = true;
        });
        return data.members;
    }
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
