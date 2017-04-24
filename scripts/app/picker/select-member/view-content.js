var _ = require('lodash/collection'),
    $ = require('jquery');

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
    'click check-all': 'checkAllMember'
};

exports.handlers = {
    checkMember: function(value, e, ele) {
        var member = _.find(this.bindings.members.data,
            function(o) {
                return o.id === value;
            }),
            ids = _.map(this.module.renderOptions.ids.split(','), function(i) {
                return { id: i };
            }),
            tempIds;


        if (!ele.checked) {
            $(this.$('check-all')).prop('checked', false);
            if (_.find(ids, ['id', value])) {
                tempIds = _.reject(ids, ['id', value]);
                this.module.renderOptions.ids = tempIds.join(',');
            }
        }

        this.bindings.state.keepCheckedMembers(member, ele.checked);
    },
    checkAllMember: function(v, e) {
        var me = this,
            ids = _.map(this.module.renderOptions.ids.split(','), function(i) {
                return { id: i };
            }),
            tempIds;

        if (e.checked) {
            _.forEach(this.bindings.members.data, function(m) {
                me.bindings.state.keepCheckedMembers(m, true);
                $(me.$('select_' + m.id)).prop('checked', true);
            });
        } else {
            _.forEach(this.bindings.members.data, function(m) {
                me.bindings.state.keepCheckedMembers(m, false);
                $(me.$('select_' + m.id)).prop('checked', false);
                if (_.find(ids, ['id', m.id])) {
                    tempIds = _.reject(ids, ['id', m.id]);
                    me.module.renderOptions.ids = tempIds.join(',');
                }
            });
        }
    }
};
exports.dataForTemplate = {
    members: function(data) {
        var ids = _.map(this.module.renderOptions.ids.split(','), function(i) {
                return { id: i };
            }),
            checkMembers = _.map(_.filter(this.bindings.state.getCheckedMembers(), function(m) {
                return m.checked;
            }), function(mm) {
                return { id: mm.member.id };
            });

        _.map(data.members || [], function(x) {
            var m = x || {};
            if (_.find(ids, ['id', m.id]) || _.find(checkMembers, ['id', m.id])) {
                m.checked = true;
            }
            m.sexText = m.sex === 1 ? '女' : '男';
            if (m.organization.level && m.organization.level <= 3) {
                m.organization.companyName = m.organization.name;
                m.organization.name = '';
            }
        });
        return data.members;
    },
    checkAll: function(data) {
        var ids = _.map(this.module.renderOptions.ids.split(','), function(i) {
                return { id: i };
            }),
            checkMembers = _.map(_.filter(this.bindings.state.getCheckedMembers(), function(m) {
                return m.checked;
            }), function(mm) {
                return { id: mm.member.id };
            }),
            checkAll;

        checkAll = _.every(data.members, function(m) {
            return _.find(checkMembers, ['id', m.id]);
        });

        if (checkAll) return checkAll;
        return _.every(data.members, function(m) {
            return _.find(ids, ['id', m.id]);
        });
    }
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
