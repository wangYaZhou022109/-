var $ = require('jquery');

exports.title = '请选择您要变更的签到状态';

exports.type = 'form';

exports.bindings = {
    signDetail: true,
    state: true,
};

exports.actions = {
    'click update': 'update'
};

exports.dataForActions = {
    update: function(payload) {
        var data = payload;
        var id = this.bindings.state.data.id;
        data.id = id;
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

exports.dataForTemplate = {
    state: function(data) {
        var lulu = data.state.id;
        return lulu;
    }
};
