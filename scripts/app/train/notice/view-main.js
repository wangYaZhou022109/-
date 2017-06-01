
var markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    $ = require('jquery');

exports.bindings = {
    signupInfo: true,
    state: true,
    export: false,
    downloadDoc: false
};

exports.events = {
    'click isOpen-*': 'changeTime',
    'click usingTwoBrings': 'changeQuestion',
    'click copy': 'copyCode'
};

exports.handlers = {
    changeTime: function(data) {
        if (data === '0') {
            this.$('startTime').value = '';
            this.$('endTime').value = '';
        }
    },
    changeQuestion: function(e, obj) {
        if (!obj.checked) {
            this.$('question1').value = '';
            this.$('question2').value = '';
        }
    },
    copyCode: function() {

    }
};

exports.actions = {
    'click save': 'save'
};

exports.dataForActions = {
    save: function(payload) {
        var usingTwoBrings = this.$('usingTwoBrings'),
            data = payload;
        if (this.validate()) {
            data.usingTwoBrings = usingTwoBrings.checked ? 1 : 0;
            return data;
        }
        return false;
    }
};

exports.actionCallbacks = {

};

exports.dataForTemplate = {
    signupInfo: function() {
        var signupInfo = this.bindings.signupInfo.data;
        if (signupInfo) {
            signupInfo.checked = signupInfo.isOpen === 1;
            signupInfo.isUsingTwoB = signupInfo.usingTwoBrings === 1;
            if (!signupInfo.id) {
                signupInfo.checked = true;
                signupInfo.isUsingTwoB = true;
            }
            if (!signupInfo.checked) {
                signupInfo.startTime = 0;
                signupInfo.endTime = 0;
            }
            if (!signupInfo.isUsingTwoB) {
                signupInfo.question1 = '';
                signupInfo.question2 = '';
            }
        }
        return signupInfo;
    },
    downUrl: function() {
        var model = this.bindings.export,
            state = this.bindings.state.data,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        url += ('classId=' + state.classId);
        url += ('&access_token=' + token);
        return url;
    },
    docUrl: function() {
        var model = this.bindings.downloadDoc,
            state = this.bindings.state.data,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        url += ('classId=' + state.classId);
        url += ('&access_token=' + token);
        return url;
    },
    isGrant: function() {
        var state = this.bindings.state.data;
        if (state.role === 1 || state.role === 2) {
            return true;
        }
        return false;
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
}, function() {
    var code = this.bindings.signupInfo.data.signupCode;
    return {
        id: 'qrcode',
        name: 'qrcode',
        options: {
            width: 128,
            height: 128,
            text: code
        }
    };
}];

exports.mixin = {
    validate: function() {
        var isOpen = $(this.$$('input[name="isOpen"]:checked')),
            startTime = $(this.$('startTime')),
            endTime = $(this.$('endTime')),
            usingTwoBrings = this.$('usingTwoBrings').checked,
            question1 = $(this.$('question1')),
            question2 = $(this.$('question2')),
            startDate,
            endDate,
            flag = true;

        markers.text.valid(startTime);
        markers.text.valid(endTime);
        markers.text.valid(question1);
        markers.text.valid(question2);
        if (isOpen.val() === '1' && !validators.required.fn(startTime.val())) {
            markers.text.invalid(startTime, validators.required.message);
            flag = false;
        }
        if (isOpen.val() === '1' && !validators.required.fn(endTime.val())) {
            markers.text.invalid(endTime, validators.required.message);
            flag = false;
        }
        startDate = new Date(startTime.val());
        endDate = new Date(endTime.val());
        if (isOpen.val() === '1' && startDate.getTime() >= endDate.getTime()) {
            markers.text.invalid(endTime, '报名结束时间要大于报名开始时间');
            flag = false;
        }
        if (usingTwoBrings && !validators.required.fn(question1.val())) {
            markers.text.invalid(question1, validators.required.message);
            flag = false;
        }
        if (usingTwoBrings && !validators.required.fn(question2.val())) {
            markers.text.invalid(question2, validators.required.message);
            flag = false;
        }
        return flag;
    }
};
