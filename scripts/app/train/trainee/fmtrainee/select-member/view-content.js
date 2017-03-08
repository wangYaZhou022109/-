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
        // var member = _.find(this.bindings.members.data,
        //     function(o) {
        //         return o.id === value;
        //     });
        var data = this.bindings.state.data,
            id = value;
        if (ele.checked) {
            data.ids.push(id);
        } else {
            _.remove(data.ids, function(n) {
                return n === id;
            });
        }
        // this.module.renderOptions.callback(member, ele.checked);
    }
};

exports.dataForTemplate = {
    members: function(data) {
        // var ids = this.module.renderOptions.ids;
        // console.log(ids);
        // if (ids) {
        //     _.map(data.members || [], function(x) {
        //         var m = x || {};
        //         if (ids.indexOf(m.id) !== -1) m.checked = true;
        //     });
        // }
        return data.members;
    }
};
exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};