var $ = require('jquery');

exports.bindings = {
    state: false,
    exam: false,
    questionTypes: true
};

exports.events = {
    'click q-*': 'showQuestion',
    'click list-item-*': 'toggleMore'
};

exports.handlers = {
    toggleMore: function(id, e, target) {
        this.module.dispatch('changeState', { typeIndex: Number(id) });
        $(target).find('.min-btn-groups').slideToggle();
        $(target).siblings().find('.min-btn-groups').slideUp();
    },
    showQuestion: function(id, e, target) {
        e.preventDefault();
        $(target).addClass('active').siblings().removeClass('active');
        return this.module.dispatch('changeState', { questionId: id });
    }
};

exports.type = 'dynamic';

exports.getEntity = function() {
    return {
        endTime: this.bindings.exam.data.endTime,
        duration: this.bindings.exam.data.duration
    };
};

exports.getEntityModuleName = function() {
    return 'exam/answer-paper-test/count-down';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: function() {
            me.app.viewport.modal(me.module.items.tips, { message: '交卷时间到' });
        }
    };
};

exports.dataForTemplate = {
    questionTypes: function() {
        return this.bindings.questionTypes.data;
    }
};
