var options = require('./app/exam/exam/base-paper/view-side'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    events = D.assign({}, obj.events),
    handlers = D.assign({}, obj.handlers),
    dataForTemplate = D.assign({}, obj.dataForTemplate);

obj.events = events;
D.assign(obj.events, {
    'click show-exam-notes': 'showExamNotes'
});

obj.handlers = handlers;
D.assign(obj.handlers, {
    showExamNotes: function() {
        this.app.viewport.modal(this.module.items['exam-notes']);
    }
});

obj.dataForTemplate = dataForTemplate;
D.assign(obj.dataForTemplate, {
    showExamNotes: function(data) {
        return data.state.examNotes;
    }
});

module.exports = obj;
