var H = require('./app/util/helpers');

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    research: function(data) {
        var researchRecord = data.researchRecord,
            research = researchRecord.researchQuestionary,
            now = new Date().getTime(),
            buttons = [],
            title = '问卷须知',
            content = research.questionaryDetail,
            detailButton = {
                id: 'research-answer',
                text: '查看详情',
                url: '#/exam/research-activity/research-answer/' + researchRecord.id,
                target: true
            };
        if (!researchRecord.id) { // 没有权限
            this.options.title = '温馨提示';
            content = '抱歉，您没有权限参加此调研，谢谢';
        } else if (research.startTime > now) { // 未开始
            this.options.title = '温馨提示';
            content = '您好，本次调研尚未到调研时间，请在调研时间 '
                + H.dateTime(research.startTime)
                + ' ~ ' + H.dateTime(research.endTime)
                + ' 进行调研，谢谢';
        } else if (now >= research.startTime && now <= research.endTime) { // 进行中
            if (researchRecord.status === 0) {
                buttons.push({ id: 'answer-next-time', text: '下次再答', target: false });
                buttons.push({
                    id: 'research-detail',
                    text: '开始答题',
                    url: '#/exam/research-activity/research-detail/' + research.id + '/' + research.id,
                    target: true
                });
            } else {
                buttons.push(detailButton);
            }
        } else if (now >= research.endTime) { // 已结束
            if (researchRecord.status === 0) {
                content = '您好，该调研已过期，无法参与，谢谢';
                this.options.title = '温馨提示';
            } else { // 已经答过
                buttons.push(detailButton);
            }
        }
        return {
            title: title,
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

exports.title = '问卷须知';
