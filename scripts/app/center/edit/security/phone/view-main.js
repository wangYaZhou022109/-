var $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');

exports.bindings = {
    member: true,
    phoneList: true
};

exports.dataForEntityModule = function(entity) {
    return entity;
};

exports.events = {
    'click addPhone': 'addPhone'
};

exports.handlers = {
    addPhone: function() {
        $(this.$('newPhone')).show();
        $(this.$('addPhone')).hide();
    }
};

exports.actions = {
    'click savePhone': 'savePhone',
    'click deletePhone*': 'deletePhone',
    'click setMain*': 'setMain'
};

exports.dataForActions = {
    savePhone: function() {
        var phone = this.$('phone').value;
        if (!phone) {
            this.app.message.error('手机号输入为空');
            return false;
        }
        if (!validators.phone.fn(phone)) {
            this.app.message.error('手机号输入不正确');
            return false;
        }
        return { phone: phone };
    },
    deletePhone: function(id) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '手机号删除后将无法恢复，是否确定删除该对象?';
            me.app.message.confirm(message, function() {
                resolve(id);
            }, function() {
                resolve(false);
            });
        });
    },
    setMain: function(payload) {
        return { phoneId: payload.id };
    }
};

exports.actionCallbacks = {
    deletePhone: function() {
        this.app.message.success('删除成功');
        this.module.dispatch('init');
    },
    setMain: function() {
        this.app.message.success('设置成功');
        this.module.dispatch('init');
    }
};
