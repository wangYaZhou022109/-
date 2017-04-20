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
            classId = state.classId,
            type = state.type;
        return {
            classId: classId,
            id: $(this.$$('[name="id"]')).val(),
            name: $(this.$$('[name="name"]')).val(),
            startTime: $(this.$$('[name="startTime"]')).val(),
            endTime: $(this.$$('[name="endTime"]')).val(),
            lateTime: $(this.$$('[name="lateTime"]')).val(),
            place: $(this.$$('[name="place"]')).val(),
            type: type,
        };
    }
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
    sign: function(data) {
        var sign = data.sign,
            url = window.location.protocol + '//' + window.location.host + '/';
        sign.path = url + '#/train/service/sign/' + sign.id;
        return sign;
    }
};
exports.components = [{
    id: 'startTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'endTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, {
    id: 'lateTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}, function() {
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
