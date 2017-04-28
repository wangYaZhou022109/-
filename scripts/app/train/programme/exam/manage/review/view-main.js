var _ = require('lodash/collection');
exports.bindings = {
    signups: true
};

exports.dataForTemplate = {
    signups: function(data) {
        return data.signups;
    }
};

exports.events = {
    'click pass-*': 'pass',
    'click reject-*': 'reject',
    'click batchPass': 'batchPass',
    'click batchReject': 'batchReject',
    'click check-all': 'checkAll'
};

exports.handlers = {
    checkAll: function(events, obj) {
        this.$$('input[name="signupId"]').forEach(function(x) {
            var element = x || {};
            element.checked = obj.checked;
        });
    },
    pass: function(id) {
        var me = this,
            ids = [id];
        return this.Promise.create(function(resolve) {
            var message = '是否确认通过';
            me.app.message.confirm(message, function() {
                return me.module.dispatch('update', { signUpIds: JSON.stringify(ids), status: 2 });
            }, function() {
                resolve(false);
            });
        });
    },
    reject: function(id) {
        var me = this,
            ids = [id];
        return this.Promise.create(function(resolve) {
            var message = '是否确认拒绝';
            me.app.message.confirm(message, function() {
                return me.module.dispatch('update', { signUpIds: JSON.stringify(ids), status: 3 });
            }, function() {
                resolve(false);
            });
        });
    },
    batchPass: function() {
        var me = this,
            seleteIds = _.map(me.$$('input:checked[name="signupId"]'), 'value');
        if (seleteIds.length === 0) {
            me.app.message.error('请选择考生');
            return false;
        }
        return this.Promise.create(function(resolve) {
            var message = '是否确认所选考生全部通过';
            me.app.message.confirm(message, function() {
                return me.module.dispatch('update', { signUpIds: JSON.stringify(seleteIds), status: 2 });
            }, function() {
                resolve(false);
            });
        });
    },
    batchReject: function() {
        var me = this,
            seleteIds = _.map(me.$$('input:checked[name="signupId"]'), 'value');
        if (seleteIds.length === 0) {
            me.app.message.error('请选择考生');
            return false;
        }
        return this.Promise.create(function(resolve) {
            var message = '是否确认所选考生全部拒绝';
            me.app.message.confirm(message, function() {
                return me.module.dispatch('update', { signUpIds: JSON.stringify(seleteIds), status: 3 });
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'signups' }
}];
