var $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');

var title = {
    add: '添加签到',
    edit: '编辑签到'
};

exports.buttons = [{
    text: '确定',
    action: 'save',
}];

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
        var state = this.bindings.state.data;
        var classId = state.classId;
        var type = state.type;
        var id = $(this.$$('[name="id"]')).val();
        var name = $(this.$$('[name="name"]')).val();
        var startTime = $(this.$$('[name="startTime"]')).val();
        var endTime = $(this.$$('[name="endTime"]')).val();
        var lateTime = $(this.$$('[name="lateTime"]')).val();
        var place = $(this.$$('[name="place"]')).val();
        if (!validators.required.fn(name)) {
            this.app.message.error('名称必填');
            return false;
        }
        if (!validators.required.fn(startTime)) {
            this.app.message.error('开始时间必填');
            return false;
        }
        if (!validators.required.fn(endTime)) {
            this.app.message.error('结束时间必填');
            return false;
        }
        if (startTime >= endTime) {
            this.app.message.alert('结束时间必须大于开始时间');
            return false;
        } else if (lateTime) {
            if (startTime >= lateTime) {
                this.app.message.alert('迟到时间必须大于开始时间');
                return false;
            } else if (lateTime >= endTime) {
                this.app.message.alert('结束时间必须大于迟到时间');
                return false;
            }
        }
        return {
            classId: classId,
            id: id,
            name: name,
            startTime: startTime,
            endTime: endTime,
            lateTime: lateTime,
            place: place,
            type: type
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
