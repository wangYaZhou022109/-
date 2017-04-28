var $ = require('jquery');
exports.auto = true;
exports.title = '编辑课程信息';
exports.bindings = {
    edit: true,
    state: true
};

exports.buttons = [{
    text: '提交',
    action: 'updateClass'
}];

exports.dataForActions = {
    updateClass: function(payload) {
        return this.validate() ? payload : false;
    }
};
exports.mixin = {
    validate: function() {
        return {
            lecturerCard: $(this.$$('[name="lecturerCard"]')),
            lecturerBankName: $(this.$$('[name="lecturerBankName"]')),
            lecturerBankCard: $(this.$$('[name="lecturerBankCard"]')),
            paypay: $(this.$$('[name="paypay"]')),
            pay: $(this.$$('[name="pay"]')),
            tax: $(this.$$('[name="tax"]')),
        };
    },

};
exports.actionCallbacks = {
    validate: function() {
        this.app.message.success('保存成功！');
        this.app.viewport.closeModal();
        this.module.dispatch('courseSalaryList', this.bindings.state.data);
    }
};
