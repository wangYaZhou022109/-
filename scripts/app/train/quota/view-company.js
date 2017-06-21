var validators = require('./app/ext/views/form/validators'),
    _ = require('lodash/collection');

exports.bindings = {
    quotaInfo: true,
    groupList: true,
    orgList: true,
    orgs: false,
    quotaList: false
};

exports.events = {
    'click check-all': 'checkall'
};

exports.handlers = {
    checkall: function(events, obj) {
        _.map(this.$$('input[name="box-org"]'), function(x) {
            var element = x || {};
            element.checked = obj.checked;
            return {
                id: element.value
            };
        });
    }
};

exports.actions = {
    'click addQuota': 'addQuota',
    'click group-*': 'changeGroup'
};

exports.dataForActions = {
    addQuota: function() {
        var quotaInfo = this.bindings.quotaInfo,
            orgs = this.bindings.orgs;
        if (this.validate()) {
            return {
                classId: quotaInfo.data.classId,
                orgIds: _.map(orgs.data, 'id').join(','),
                quantity: this.$('quota-input').value
            };
        }
        return false;
    }
};

exports.actionCallbacks = {
    addQuota: function() {
        this.app.viewport.closeModal();
    }
};

exports.dataForTemplate = {
    organizationList: function() {
        var orgList = this.bindings.orgList,
            quotaList = this.bindings.quotaList,
            organizationList = [];
        var ids = _.map(quotaList.data, 'organizationId').join(',');
        var arr = ids.split(',');
        // _.map(orgList.data, function(x) {
        //     var ele = x || {};
        //     if (ids.indexOf(ele.organizationId) === -1) { // 有bug，需要修改
        //         organizationList.push(ele);
        //     }
        // });
        _.map(orgList.data, function(s) {
            var o = s || {};
            var i = 0;
            _.map(arr, function(a) {
                var id = a;
                if (id.trim() === o.organizationId) {
                    i = 1;
                }
            });
            if (i !== 1) {
                organizationList.push(o);
            }
        });
        return organizationList;
    }
};

exports.mixin = {
    validate: function() {
        var quota = this.$('quota-input').value,
            flag = true,
            checkboxes = this.$$('input[name="box-org"]'),
            orgs = this.bindings.orgs,
            quotaInfo = this.bindings.quotaInfo,
            use = 0;
        orgs.clear();
        _.map(checkboxes, function(x) {
            var element = x || {};
            if (element.checked) {
                orgs.data.push({ id: element.value });
            }
        });
        if (orgs.data.length === 0) {
            this.app.message.alert('请选择单位');
            return false;
        }
        if (quota === '') {
            flag = false;
        }
        if (!validators.digits.fn(quota)) {
            flag = false;
        }
        if (validators.lessThan.fn(quota, 0)) {
            flag = false;
        }
        if (!flag) {
            this.app.message.alert('请输入大于0的整数');
            return false;
        }
        use = orgs.data.length * Number(quota);
        if (use > quotaInfo.data.overplus) {
            this.app.message.alert('超出了剩余配额');
            return false;
        }
        return flag;
    }
};
