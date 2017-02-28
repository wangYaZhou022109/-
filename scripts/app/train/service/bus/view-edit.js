exports.title = '班车/订餐信息发布';

exports.bindings = {
    bus: true
};

exports.actions = {
    'click save': 'save'
};

exports.dataForActions = {
    save: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {
    save: function() {
        this.app.message.success('保存成功！');
        // this.module.dispatch('init');
        this.app.viewport.closeModal();
    }
};
