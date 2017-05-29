var _ = require('lodash/collection');

exports.bindings = {
    waitTrainees: true,
    fmTrainees: true
};

exports.events = {
    'click checkAll': 'checkAll',
    'click check-item*': 'checkItem'
};

exports.handlers = {
    checkAll: function(events, obj) {
        var waitTrainees = this.bindings.waitTrainees.data;
        var fmTrainees = this.bindings.fmTrainees.data;
        var ids = [];
        this.$$('input[name="trainee-id"]').forEach(function(x) {
            var element = x || {};
            var id = element.value;
            element.checked = obj.checked;
            ids.push(id);
        });
        if (obj.checked) {
            _.forEach(waitTrainees, function(value) {
                var data = {};
                var member = {};
                if (!_.find(fmTrainees, ['id', value.id])) {
                    data.id = value.id;
                    data.sort = value.sort;
                    data.sortForGroup = value.sortForGroup;
                    data.organizationName = value.organizationName;
                    data.organizationOrder = value.organizationOrder;
                    member.fullName = value.member.fullName;
                    member.name = value.member.name;
                    member.sex = value.member.sex;
                    data.member = member;
                    fmTrainees.push(data);
                }
            });
        } else {
            fmTrainees = _.filter(fmTrainees, function(fm) {
                return ids.indexOf(fm.id) === -1;
            });
        }
        fmTrainees = _.sortBy(fmTrainees, ['sortForGroup', 'organizationOrder']);
        this.bindings.fmTrainees.data = fmTrainees;
        this.bindings.fmTrainees.changed();
    },
    checkItem: function(id, obj, target) {
        var fmTrainees = this.bindings.fmTrainees.data;
        var waitTrainees = this.bindings.waitTrainees.data;
        var addModel = {};
        var i = 0;
        var flag = this.$$('input[name="trainee-id"]').length === this.$$('input[name="trainee-id"]:checked').length;
        this.$('checkAll').checked = flag;
        if (target.checked) {
            addModel = _.find(waitTrainees, ['id', id]) || {};
            fmTrainees.push({
                id: addModel.id,
                sort: addModel.sort,
                sortForGroup: addModel.sortForGroup,
                organizationName: addModel.organizationName,
                organizationOrder: addModel.organizationOrder,
                member: {
                    fullName: addModel.member.fullName,
                    name: addModel.member.name,
                    sex: addModel.member.sex
                }
            });
        } else {
            for (i; i < fmTrainees.length; i++) {
                if (fmTrainees[i].id === id) {
                    fmTrainees.splice(i, 1);
                    break;
                }
            }
        }
        this.bindings.fmTrainees.data = _.sortBy(fmTrainees, ['sortForGroup', 'organizationOrder']);
        this.bindings.fmTrainees.changed();
    }
};

exports.actions = {
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'waitTrainees' }
}];

exports.dataForTemplate = {
    waitTrainees: function(data) {
        var waitTrainees = data.waitTrainees;
        var fmTrainees = this.bindings.fmTrainees.data;
        var ids = [];
        var length = 0;
        _.forEach(fmTrainees, function(fm) {
            ids.push(fm.id);
        });
        _.map(waitTrainees || [], function(x) {
            var m = x || {};
            if (ids.indexOf(m.id) !== -1) {
                m.checked = true;
                length++;
            }
        });
        waitTrainees.checkStatus = false;
        if (length === waitTrainees.length) {
            waitTrainees.checkStatus = true;
        }
        return waitTrainees;
    }
};
