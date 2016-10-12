var _ = require('lodash/collection');

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'members' }
}];

exports.title = '选择用户';

exports.bindings = {
    members: true
};

exports.events = {
    'click selectMember*': 'selectMember'
};

exports.handlers = {
    selectMember: function(value) {
        var member = _.find(this.bindings.members.data, function(o) {
            return o.id === value;
        });
        this.module.renderOptions.callback(member);
    }
};
exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
