var $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');

exports.bindings = {
    state: false
};

exports.actions = {
    'click next-step': 'getClassSignupInfo',
    'change phoneNumber': 'getMember'
};

exports.dataForActions = {
    getClassSignupInfo: function() {
        var phoneNumber = $(this.$$('[name="phoneNumber"]')).val().trim();
        var verCode = $(this.$$('[name="verCode"]')).val().trim();
        var signupCode = $(this.$$('[name="signupCode"]')).val().trim();
        var member = this.bindings.state.data.member;
        if (signupCode === '') {
            this.app.message.error('报名码不能为空');
            return false;
        }
        if (phoneNumber === '') {
            this.app.message.error('手机号不能为空');
            return false;
        }
        if (!validators.phone.fn(phoneNumber)) {
            this.app.message.error('请输入正确的手机号');
            return false;
        }
        if (verCode === '') {
            this.app.message.error('验证码不能为空');
            return false;
        }
        if (!member) {
            this.app.message.error('该手机号无效');
            return false;
        }
        return {
            phoneNumber: phoneNumber,
            verCode: verCode,
            signupCode: signupCode
        };
    },
    getMember: function() {
        var phoneNumber = $(this.$$('[name="phoneNumber"]')).val().trim();
        if (!validators.phone.fn(phoneNumber) || phoneNumber === '') {
            this.app.message.error('请输入正确的手机号');
            return false;
        }
        return { phoneNumber: phoneNumber };
    }
};

exports.actionCallbacks = {
    getClassSignupInfo: function(data) {
        var classSignupInfo = data[0];
        var nowTime = (new Date()).getTime();
        var state = this.bindings.state;
        if (classSignupInfo) {
            if (classSignupInfo.isOpen === 0) {
                this.app.message.error('该培训班暂未开放报名!');
            } else if (nowTime < classSignupInfo.startTime) {
                this.app.message.error('当前培训班报名尚未开始!');
            } else if (nowTime > classSignupInfo.endTime) {
                this.app.message.error('当前培训班报名已结束!');
            } else {
                state.data.classId = classSignupInfo.classId;
                state.data.step = 'info';
                state.changed();
                this.module.renderOptions.callback(state.data);
            }
        } else {
            this.app.message.error('报名码不存在!');
        }
    },
    getMember: function(data) {
        var state = this.bindings.state;
        if (!data[0]) {
            this.app.message.error('系统中不存在该手机号');
        } else {
            state.data.member = data[0];
            state.changed();
        }
    }
};
