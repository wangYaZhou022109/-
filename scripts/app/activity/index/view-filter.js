var $ = require('jquery');

exports.bindings = {
    params: true
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this,
            searchStatus = '';
        if (el) {
            searchStatus = el;
        }
        me.module.dispatch('search', { searchStatus: searchStatus });
    }
};

exports.actions = {
    'click search': 'search',
    'click signup': 'getClassSignupInfo'
};

exports.dataForActions = {
    search: function() {
        return {
            name: $(this.$$('[name="activity-name"]')).val()
        };
    },
    getClassSignupInfo: function() {
        var code = $(this.$$('[name="signup-code"]')).val().trim();
        if (code === '') {
            this.app.message.error('报名码不能为空!');
            return false;
        }
        return { signupCode: code };
    }
};

exports.actionCallbacks = {
    getClassSignupInfo: function(data) {
        var classSignupInfo = data[0];
        var nowTime = (new Date()).getTime();
        var url = '#/train/signup/' + classSignupInfo.classId;
        if (classSignupInfo) {
            if (classSignupInfo.isOpen === 0) {
                this.app.message.error('该培训班暂未开放报名!');
            } else if (nowTime < classSignupInfo.startTime) {
                this.app.message.error('当前培训班报名尚未开始!');
            } else if (nowTime > classSignupInfo.endTime) {
                this.app.message.error('当前培训班报名已结束!');
            } else {
                window.location.href = url;
            }
        } else {
            this.app.message.error('报名码不存在!');
        }
    }
};

exports.dataForTemplate = {
    currentStep: function(data) {
        var step = data.params.searchStatus;
        return {
            all: !step || step === '',
            running: step === 1 || step === '1',
            notStart: step === 2 || step === '2',
            finish: step === 3 || step === '3'
        };
    }
};
