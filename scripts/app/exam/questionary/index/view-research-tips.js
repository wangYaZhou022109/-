exports.title = '问卷须知';

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    research: function(data) {
        var researchRecord = data.researchRecord,
            research = researchRecord.researchQuestionary,
            buttons = [{ id: 'answer-next-time', text: '关闭', target: false }],
            content;

        if (!researchRecord || !researchRecord.status) {
            buttons.push({
                id: 'research-detail',
                text: '开始答题',
                url: '#/exam/questionary/research-detail/' + research.id,
                target: true
            });
            content = research.questionaryDetail;
        } else {
            content = '您已经参与该问卷了';
        }
        return {
            content: content,
            buttons: buttons
        };
    }
};

exports.events = {
    'click button-*': 'doSome'
};

exports.handlers = {
    doSome: function(id) {
        if (id.indexOf('answer-next-time') > -1) {
            this.app.viewport.closeModal();
        }
    }
};

exports.beforeRender = function() {
};
