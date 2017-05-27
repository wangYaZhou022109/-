var strings = require('./app/util/strings'),
    $ = require('jquery');

exports.bindings = {
    researchRecord: true,
    state: false
};

exports.events = {
    'click submit': 'submit'
};

exports.handlers = {
    submit: function(param) {
        var me = this,
            message = strings.get('exam.research.research-detail.confirm-submit'),
            disabledClass = this.app.options.disabledClass;
        // 防止重复提交
        if ($(param.target).hasClass(disabledClass)) return true;
        $(param.target).addClass(disabledClass);
        // 还有未答的题目
        if (!me.bindings.state.isComplete()) {
            message = strings.get('exam.submit-paper-confirm.no-finish');
        }
        return this.app.message.confirm(message, function() {
            return me.module.dispatch('saveResearchDetail').then(function() {
                $(param.target).removeClass(disabledClass);
            }, function() {
                $(param.target).removeClass(disabledClass);
            });
        }, function() {
            $(param.target).removeClass(disabledClass);
            return false;
        });
    }
};

exports.dataForTemplate = {
    memberTitle: function(data) { // 调研人/评估人
        var researchQuestionary = data.researchRecord.researchQuestionary || {};
        return researchQuestionary.type === 3 ? '评估人员' : '调研人员';
    }
};
