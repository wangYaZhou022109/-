var options = require('./app/exam/exam/base-paper/view-exam-notes'),
    D = require('drizzlejs'),
    $ = require('jquery'),
    helper = require('./answer-helper'),
    obj = D.assign({}, options),
    title = { examNote: '考前须知', tips: '温馨提示' },
    bindings = D.assign({}, obj.bindings),
    dataForTemplate = D.assign({}, obj.dataForTemplate),
    events = D.assign({}, obj.events),
    handlers = D.assign({}, obj.handlers);


D.assign(obj, {
    title: function() {
        var state = this.bindings.state.data;
        if (state.tips || state.message) {
            return title.tips;
        }
        return title.examNote;
    },
    afterClose: function() {
        var state = this.bindings.state.data;
        if (state.tips && state.showAnswerDetail !== 1) {
            return this.module.dispatch('clearModels').then(function() {
                helper.removeCloseListener();
                window.close();
            });
        } else if (state.over) {
            return this.module.dispatch('clearModels');
        }
        return '';
    }
});

obj.bindings = bindings;
D.assign(obj.bindings, {
    exam: true
});

obj.dataForTemplate = dataForTemplate;
D.assign(obj.dataForTemplate, {
    state: function(data) {
        //  交卷后提示
        if (data.state.tips) {
            return D.assign(data.state, {
                examNotes: data.state.tips
            });
        }
        //  开始过程中提示
        if (data.state.message) {
            return D.assign(data.state, {
                examNotes: data.state.message
            });
        }
        //  须知
        if (data.state.noticed) {
            return data.state;
        }
        return data.state;
    },
    canShowDetail: function(data) {
        return data.exam.isShowAnswerImmed === 1 && data.state.over;
    }
});

obj.events = events;
D.assign(obj.events, {
    'click show-answer-detail': 'showAnswerDetail'
});

obj.handlers = handlers;
D.assign(obj.handlers, {
    showAnswerDetail: function() {
        var me = this;
        $('.achievement-content').html('');
        $('.achievement-content').hide();
        return this.module.dispatch('showAnswerDetail').then(function() {
            me.app.viewport.closeModal();
        });
    }
});

module.exports = obj;
