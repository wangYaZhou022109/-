var $ = require('jquery');

exports.bindings = {
    search: true
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(value) {
        return this.module.dispatch('search', { searchStatus: value === 0 ? null : Number(value) });
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
        var search = data.search;
        return {
            all: search.searchStatus === 0,
            running: search.searchStatus === 1,
            notStart: search.searchStatus === 2,
            finish: search.searchStatus === 3,
        };
    }
};
