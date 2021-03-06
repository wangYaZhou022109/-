exports.title = '问卷须知';

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    research: function(data) {
        var researchRecord = data.researchRecord || {},
            research = researchRecord.researchQuestionary || {},
            now = new Date().getTime(),
            buttons = [{ id: 'answer-next-time', text: '下次再答', target: false }];
        if (now >= research.startTime && now <= research.endTime) {
            if (researchRecord.status === 0 || researchRecord.status === null) {
                buttons.push({
                    id: 'research-detail',
                    text: '开始答题',
                    url: '#/train/class-detail/research-detail/' + research.id,
                    target: true
                });
            } else {
                buttons = [];
                buttons.push({
                    id: 'research-answer',
                    text: '查看详情',
                    url: '#/train/class-detail/research-answer/' + researchRecord.id,
                    target: true
                });
            }
        }
        return {
            content: research.questionaryDetail,
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
