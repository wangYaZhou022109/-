var strings = require('./app/util/strings');

exports.bindings = {
    researchRecord: true,
    state: false
};

exports.events = {
    'click submit': 'submit'
};

exports.handlers = {
    submit: function() {
        var me = this,
            message = strings.get('exam.research.research-detail.confirm-submit');
        // 还有未答的题目
        if (!me.bindings.state.isComplete()) {
            message = strings.get('exam.submit-paper-confirm.no-finish');
        }
        this.app.message.confirm(message, function() {
            return me.module.dispatch('saveResearchDetail');
        }, function() {
            return false;
        });
    }
};

exports.dataForTemplate = {
    memberTitle: function(data) { // 调研人/评估人
        var researchQuestionary = data.researchRecord.researchQuestionary || {};
        return researchQuestionary.type === 3 ? '评估人' : '调研人';
    }
};
