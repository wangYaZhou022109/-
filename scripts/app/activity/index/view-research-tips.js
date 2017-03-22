exports.title = '问卷须知';

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    research: function(data) {
        var researchRecord = data.researchRecord,
            research = researchRecord.researchQuestionary,
            now = new Date().getTime(),
            buttons = [];

        if (now >= research.startTime && now <= research.endTime) {
            if (researchRecord.status === 0) {
                buttons.push({
                    id: 'research-detail',
                    text: '开始答题',
                    url: '#/exam/research-activity/research-detail/' + research.id
                });
            } else if (researchRecord.researchQuestionary.permitViewCount === 1) {
                buttons.push({
                    id: 'research-summary-detail',
                    text: '查看详情',
                    url: '#/exam/research-activity/research-summary-detail/' + researchRecord.id
                });
            } else {
                buttons.push({
                    id: 'research-answer-detail',
                    text: '查看详情',
                    url: '#/exam/research-activity/research-answer-detail/' + researchRecord.id
                });
            }
        }
        return {
            content: research.researchQuestionary,
            buttons: buttons
        };
    }
};

exports.beforeRender = function() {
};
