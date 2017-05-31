var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    quotaInfo: true,
    quotaList: true,
    state: true,
    check: false
};

exports.events = {
    'click checkall': 'checkall',
    'click ids-*': 'checkone'
};

exports.handlers = {
    checkall: function(events, obj) {
        var check = this.bindings.check;
        var ids = _.map(this.$$('input[name="ids"]'), function(x) {
            var element = x || {};
            element.checked = obj.checked;
            return {
                id: element.value
            };
        });
        if (obj.checked) {
            check.data = ids;
        } else {
            check.data = [];
        }
    },
    checkone: function(id) {
        var check = this.bindings.check,
            index,
            checked;
        checked = this.$('ids-' + id).checked;
        if (checked) {
            check.data.push({ id: id });
        } else {
            index = check.data.findIndex(function(e) {
                return e.id === id;
            });
            check.data.splice(index, 1);
        }
    }
};

exports.actions = {
    'click del-quota-*': 'del',
    'click deleteMulti': 'deleteMulti',
    'click quota-type-1': 'changeType1',
    'click quota-type-2': 'changeType2',
    'click is-auto-1': 'changeApprove1',
    'click is-auto-0': 'changeApprove0',
    'click add': 'showGroup'
};

exports.dataForActions = {
    deleteMulti: function() {
        var check = this.bindings.check,
            me = this;
        if (check.data.length === 0) {
            this.app.message.alert('请至少选择一个单位');
            return false;
        }
        return this.Promise.create(function(resolve) {
            var message = '确定删除此数据吗?';
            me.app.message.confirm(message, function() {
                resolve(_.map(check.data, 'id').join(','));
            }, function() {
                resolve(false);
            });
        });
    },
    del: function(payload) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定删除此数据吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('del', payload);
            }, function() {
                resolve(false);
            });
        });
    },
    changeType1: function() {
        var quotaInfo = this.bindings.quotaInfo,
            me = this;
        if (quotaInfo.data.type === 1) {
            return false;
        }
        return this.Promise.create(function(resolve) {
            var message = '确定要将配额方式修改为整体配额吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('changeType', { type: 1 });
                $(me.$('quota-type-1')).addClass('active').siblings().removeClass('active');
            }, function() {
                resolve(false);
            });
        });
    },
    changeType2: function() {
        var quotaInfo = this.bindings.quotaInfo,
            me = this;
        if (quotaInfo.data.type === 2) {
            return false;
        }
        return this.Promise.create(function(resolve) {
            var message = '确定要将配额方式修改为分省配额吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('changeType', { type: 2 });
                $(me.$('quota-type-2')).addClass('active').siblings().removeClass('active');
            }, function() {
                resolve(false);
            });
        });
    },
    changeApprove1: function() {
        var quotaInfo = this.bindings.quotaInfo,
            me = this;
        if (quotaInfo.data.isAutoApprove === 1) {
            return false;
        }
        return this.Promise.create(function(resolve) {
            var message = '确定要将审核方式修改为自动审批吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('changeApproval', { isAutoApprove: 1 });
            }, function() {
                me.$('is-auto-1').checked = false;
                me.$('is-auto-0').checked = true;
                resolve(false);
            });
        });
    },
    changeApprove0: function() {
        var quotaInfo = this.bindings.quotaInfo,
            me = this;
        if (quotaInfo.data.isAutoApprove === 0) {
            return false;
        }
        return this.Promise.create(function(resolve) {
            var message = '确定要将审核方式修改为手动审批吗?';
            me.app.message.confirm(message, function() {
                me.module.dispatch('changeApproval', { isAutoApprove: 0 });
            }, function() {
                me.$('is-auto-1').checked = true;
                me.$('is-auto-0').checked = false;
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    showGroup: function() {
        this.app.viewport.modal(this.module.items.company);
    },
    deleteMulti: function() {
        var check = this.bindings.check;
        check.clear();
    }
};

exports.dataForTemplate = {
    checked: function() {
        var quotaInfo = this.bindings.quotaInfo;
        return {
            isAutoApprove1: quotaInfo.data.isAutoApprove === 1,
            isType1: quotaInfo.data.type === 1,
            isType2: quotaInfo.data.type === 2
        };
    },
    quotaInfo: function() {
        var quotaInfo = this.bindings.quotaInfo,
            quotaList = this.bindings.quotaList,
            sum = 0;
        if (quotaInfo.data.type === 1) {
            quotaInfo.data.overplus = 0;
        } else {
            _.map(quotaList.data, function(x) {
                sum += x.quantity;
            });
            quotaInfo.data.overplus = quotaInfo.data.amount - sum;
        }
        return quotaInfo.data;
    },
    quotaList: function() {
        var quotaList = this.bindings.quotaList,
            state = this.bindings.state.data;
        _.map(quotaList.data, function(q) {
            var x = q;
            if (state.role === 2 || state.role === 1) {
                x.isGrant = true;
            } else {
                x.isGrant = false;
            }
        });
        return quotaList.data;
    },
    isGrant: function() {
        var state = this.bindings.state.data;
        if (state.role === 2 || state.role === 1) {
            return true;
        }
        return false;
    }
};
