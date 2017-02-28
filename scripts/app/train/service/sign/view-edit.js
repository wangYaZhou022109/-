var $ = require('jquery');

var title = {
    add: '添加签到',
    edit: '编辑签到'
};

exports.type = 'form';

exports.title = function() {
    return title[this.renderOptions.type];
};

exports.bindings = {
    sign: true
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

exports.mixin = {
    validate: function() {
        return {
            name: $(this.$$('[name="name"]')),
            startTime: $(this.$$('[name="startTime"]')),
            endTime: $(this.$$('[name="endTime"]')),
            lateTime: $(this.$$('[name="lateTime"]')),
            place: $(this.$$('[name="place"]')),
        };
    },

};

exports.components = [function() {
    var signId = this.bindings.sign.data.id;
    return {
        id: 'qrcode',
        name: 'qrcode',
        options: {
            width: 128,
            height: 128,
            text: signId
        }
    };
}];

exports.dataForTemplate = {
    sign: function(data) {
        var sign = data.sign,
            url = window.location.protocol + '//' + window.location.host + '/';
        sign.path = url + '#/train/service/sign/' + sign.id;
        return sign;
    }
};
// exports.components = [{
//     id: 'startTime',
//     name: 'flatpickr',
//     options: {
//         enableTime: true
//     }
// }, {
//     id: 'endTime',
//     name: 'flatpickr',
//     options: {
//         enableTime: true
//     }
// }, {
//     id: 'lateTime',
//     name: 'flatpickr',
//     options: {
//         enableTime: true
//     }
