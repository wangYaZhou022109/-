var _ = require('lodash/collection');

exports.bindings = {
    waitTrainees: true,
    fmTrainees: true,
    newTrainees: false
};

exports.events = {
    'click checkAll': 'checkAll',
    'click check-item*': 'checkItem'
};

exports.handlers = {
    checkAll: function(events, obj) {
        var waitTrainees = this.bindings.waitTrainees.data;
        var fmTrainees = this.bindings.fmTrainees.data;
        var newTrainees = this.bindings.newTrainees.data;
        var ids = [];
        this.$$('input[name="trainee-id"]').forEach(function(x) {
            var element = x || {};
            var id = element.value;
            element.checked = obj.checked;
            ids.push(id);
        });
        if (obj.checked) {
            _.forEach(ids, function(id) {
                if (newTrainees.indexOf(id) === -1) {
                    newTrainees.push(id);
                }
            });
            _.forEach(waitTrainees, function(value) {
                var data = {};
                var member = {};
                if (!_.find(fmTrainees, ['id', value.id])) {
                    data.id = value.id;
                    data.sort = value.sort;
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
            newTrainees = _.filter(newTrainees, function(id) {
                return ids.indexOf(id) === -1;
            });
            fmTrainees = _.filter(fmTrainees, function(fm) {
                return ids.indexOf(fm.id) === -1;
            });
        }
        fmTrainees = _.sortBy(fmTrainees, ['sort', 'organizationOrder']);
        this.bindings.fmTrainees.data = fmTrainees;
        this.bindings.newTrainees.data = newTrainees;
        this.bindings.fmTrainees.changed();
        this.bindings.newTrainees.changed();
    },
    checkItem: function(id, obj, target) {
        var fmTrainees = this.bindings.fmTrainees.data;
        var waitTrainees = this.bindings.waitTrainees.data;
        var newTrainees = this.bindings.newTrainees.data;
        var addModel = {};
        var i = 0,
            j = 0;
        var flag = this.$$('input[name="trainee-id"]').length === this.$$('input[name="trainee-id"]:checked').length;
        this.$('checkAll').checked = flag;
        if (target.checked) {
            newTrainees.push(id);
            addModel = _.find(waitTrainees, ['id', id]) || {};
            fmTrainees.push({
                id: addModel.id,
                sort: addModel.sort,
                member: {
                    fullName: addModel.member.fullName,
                    name: addModel.member.name
                }
            });
        } else {
            for (i; i < newTrainees.length; i++) {
                if (newTrainees[i] === id) {
                    newTrainees.splice(i, 1);
                    break;
                }
            }
            for (j; j < fmTrainees.length; j++) {
                if (fmTrainees[j].id === id) {
                    fmTrainees.splice(j, 1);
                    break;
                }
            }
        }
        this.bindings.fmTrainees.data = _.sortBy(fmTrainees, 'sort');
        this.bindings.newTrainees.changed();
        this.bindings.fmTrainees.changed();
    }
};

exports.actions = {
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'waitTrainees' }
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
