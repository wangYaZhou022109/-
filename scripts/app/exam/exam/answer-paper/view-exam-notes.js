var options = require('./app/exam/exam/base-paper/view-exam-notes'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    title = { examNote: '考前须知', tips: '温馨提示' },
    dataForTemplate = D.assign({}, obj.dataForTemplate);


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

obj.dataForTemplate = dataForTemplate;
D.assign(obj.dataForTemplate, {
    exam: function(data) {
        if (data.state.tips) {
            D.assign(data.state, {
                examNotes: data.state.tips
            });
        }
    }
});

module.exports = obj;
