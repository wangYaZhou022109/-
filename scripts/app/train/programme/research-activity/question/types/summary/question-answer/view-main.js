var MORE = 0;

exports.bindings = {
    question: true
};

exports.events = {
    'click more': 'viewMore'
};

exports.handlers = {
    viewMore: function() {
        var mod = this.module.items['train/programme/question/types/research-detail-summary/question-answer/more'];
        this.app.viewport.popup(mod, {
            question: this.bindings.question.data
        });
    }
};

exports.dataForTemplate = {
    biggerThan: function(data) {
        return data.question.answerRecords.length > MORE;
    },
    answerRecords: function(data) {
        var result = [],
            answerRecords = data.question.answerRecords,
            i = 0;
        for (i = 0; i < answerRecords.length; i++) {
            result.push(answerRecords[i]);
            if ((i + 1) > MORE) {
                break;
            }
        }
        return result;
    }
};
