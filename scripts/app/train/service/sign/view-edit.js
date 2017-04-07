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
    sign: true,
    state: true,
};

exports.actions = {
    'click save': 'save'
};

exports.dataForActions = {
    save: function() {
        var state = this.bindings.state.data,
            classId = state.classId;
        return {
            classId: classId,
            name: $(this.$$('[name="name"]')).val(),
            startTime: $(this.$$('[name="startTime"]')).val(),
            endTime: $(this.$$('[name="endTime"]')).val(),
            lateTime: $(this.$$('[name="lateTime"]')).val(),
            place: $(this.$$('[name="place"]')).val(),
        };
    }
};

exports.actionCallbacks = {
    save: function() {
        this.app.message.success('保存成功！');
        this.app.viewport.closeModal();
    }
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
