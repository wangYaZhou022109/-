var options = require('./app/exam/exam/base-paper/view-exam-notes'),
    D = require('drizzlejs'),
    $ = require('jquery'),
    obj = D.assign({}, options),
    title = { examNote: '考前须知', tips: '温馨提示' },
    bindings = D.assign({}, obj.bindings),
    dataForTemplate = D.assign({}, obj.dataForTemplate),
    events = D.assign({}, obj.events),
    handlers = D.assign({}, obj.handlers);


D.assign(obj, {
    title: function() {
        var state = this.bindings.state.data;
        if (state.tips) {
            return title.tips;
        }
        return title.examNote;
    },
    afterClose: function() {
        var state = this.bindings.state.data;
        if (state.tips && state.showAnswerDetail !== 1) {
            return this.module.dispatch('clearModels').then(function() {
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
        if (data.state.tips) {
            return D.assign(data.state, {
                examNotes: data.state.tips
            });
        }
        if (data.state.message) {
            return D.assign(data.state, {
                examNotes: data.state.message
            });
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
