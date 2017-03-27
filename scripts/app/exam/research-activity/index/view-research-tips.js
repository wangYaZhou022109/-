exports.title = '问卷须知';

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    research: function(data) {
        var researchRecord = data.researchRecord,
            research = researchRecord.researchQuestionary,
            now = new Date().getTime(),
            buttons = [{ id: 'answer-next-time', text: '下次来答', target: false }];

        if (now >= research.startTime && now <= research.endTime) {
            if (researchRecord.status === 0) {
                buttons.push({
                    id: 'research-detail',
                    text: '开始答题',
                    url: '#/exam/research-activity/research-detail/' + research.id,
                    target: true
                });
            } else if (researchRecord.researchQuestionary.permitViewCount === 1) {
                buttons = [];
                buttons.push({
                    id: 'research-summary-detail',
                    text: '查看详情',
                    url: '#/exam/research-activity/research-summary-detail/' + researchRecord.id,
                    target: true
                });
            } else {
                buttons = [];
                buttons.push({
                    id: 'research-answer-detail',
                    text: '查看详情',
                    url: '#/exam/research-activity/research-answer-detail/' + researchRecord.id,
                    target: true
                });
            }
        }
        return {
            content: research.researchQuestionary,
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
