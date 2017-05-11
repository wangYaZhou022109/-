var $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');
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
        var lecturerCard = $(this.$$('[name="lecturerCard"]')).val(),
            lecturerBankName = $(this.$$('[name="lecturerBankName"]')).val(),
            lecturerBankCard = $(this.$$('[name="lecturerBankCard"]')).val(),
            paidPay = $(this.$$('[name="paidPay"]')).val(),
            pay = $(this.$$('[name="pay"]')).val(),
            tax = $(this.$$('[name="tax"]')).val();
        if (!validators.idCard.fn(lecturerCard) && validators.required.fn(lecturerCard)) {
            this.app.message.error('请正确输入讲师身份证');
            return false;
        }
        if (!validators.required.fn(lecturerBankName)) {
            this.app.message.error('开户银行必填');
            return false;
        }
        if (!validators.required.fn(lecturerBankCard) && validators.number.fn(lecturerBankCard)) {
            this.app.message.error('请正确输入银行卡号');
            return false;
        }
        if (!validators.required.fn(paidPay) && validators.number.fn(paidPay)) {
            this.app.message.error('请正确输入实付金额');
            return false;
        }
        if (!validators.required.fn(pay) && validators.number.fn(pay)) {
            this.app.message.error('请正确输入酬金');
            return false;
        }
        if (!validators.required.fn(tax) && validators.number.fn(tax)) {
            this.app.message.error('请正确输入税金');
            return false;
        }
        return payload;
    }
};

