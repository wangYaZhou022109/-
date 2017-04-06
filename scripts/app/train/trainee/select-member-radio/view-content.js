
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
    checkMember: function(value) {
        var members = this.bindings.members.data,
            index;
        index = members.findIndex(function(e) {
            return e.id === value;
        });
        this.bindings.state.data = members[index];
    }
};

exports.dataForTemplate = {
    members: function(data) {
        return data.members;
    }
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
