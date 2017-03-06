// var $ = require('jquery');

exports.bindings = {
    exam: false,
    questionTypes: true
};

exports.events = {
    'click prev-*': 'prev',
    'click next-*': 'next',
    'click q-*': 'showQuestion',
    'click list-item-*': 'toggleMore'
};

exports.handlers = {
    prev: function(id, e) {
        e.preventDefault();
        return this.module.dispatch('move', -1);
    },
    next: function(id, e) {
        e.preventDefault();
        return this.module.dispatch('move', 1);
    },
    showQuestion: function(id, e) {
        e.preventDefault();
        // $(target).addClass('active').siblings().removeClass('active');
        return this.module.dispatch('changeState', { questionId: id });
    },
    toggleMore: function(id, e) {
        e.stopPropagation();
        this.module.dispatch('changeState', { typeIndex: Number(id) });
        // $(target).find('.min-btn-groups').slideToggle();
        // $(target).siblings().find('.min-btn-groups').slideUp();
    },
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
            me.module.dispatch('submit', { submitType: 'Hand' });
            me.app.viewport.modal(me.module.items.tips, { message: '交卷时间到,你本次考试已被强制交卷' });
        }
    };
};

exports.dataForTemplate = {
    questionTypes: function() {
        return this.bindings.questionTypes.data;
    }
};
