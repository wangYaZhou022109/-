var _ = require('lodash/Array');

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'members' }
}];

exports.title = '选择用户';

exports.bindings = {
    members: true,
    state: true
};

exports.events = {
    'click select_*': 'checkMember',
    'click addTrainee': 'addTrainee'
};

exports.handlers = {
    checkMember: function(value, e, ele) {
        var data = this.bindings.state.data,
            id = value,
            fullName = ele.getAttribute('fullName');
        if (ele.checked) {
            data.push({ id: id, fullName: fullName });
        } else {
            _.remove(data, function(n) {
                return n.id === id;
            });
        }
        this.bindings.state.changed();
    },
    addTrainee: function() {
        var checkedMembers = this.bindings.state.data;
        var ids = [];
        _.forEach(checkedMembers, function(v) {
            ids.push(v.id);
        });
        this.module.renderOptions.callback(ids.join(','));
    }
};

exports.dataForTemplate = {
    members: function(data) {
        var checkedMembers = this.bindings.state.data;
        var ids = [];
        _.forEach(checkedMembers, function(v) {
            ids.push(v.id);
        });
        if (ids) {
            _.map(data.members || [], function(x) {
                var m = x || {};
                if (ids.indexOf(m.id) !== -1) m.checked = true;
            });
        }
        return data.members;
    }
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
