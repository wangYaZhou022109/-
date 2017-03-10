var $ = require('jquery');

exports.type = '请假审批';

exports.bindings = {
    leave: true,
    lea: true,
    state: {}
};

exports.actions = {
    'click update': 'update'
};

exports.dataForActions = {
    update: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {
    update: function() {
        // this.app.message.success('保存成功！');
        this.app.viewport.closeModal();
    }
};

exports.mixin = {
    validate: function() {
        return {
            state: $(this.$$('[name="state"]')),
        };
    },
};
