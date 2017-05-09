var H = require('./app/util/helpers');

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    research: function(data) {
        var researchRecord = data.researchRecord,
            research = researchRecord.researchQuestionary,
            now = new Date().getTime(),
            content = research.questionaryDetail;
        this.options.closeText = '关闭';
        this.options.title = '问卷须知';
        if (!researchRecord.id) { // 没有权限
            this.options.title = '温馨提示';
            content = '抱歉，您没有权限参加此调研，谢谢';
        } else if (research.startTime > now) { // 未开始
            this.options.title = '温馨提示';
            content = '您好，本次调研尚未到调研时间，请在调研时间 '
                + H.dateMinute(research.startTime)
                + ' ~ ' + H.dateMinute(research.endTime)
                + ' 进行调研，谢谢';
        } else if (now >= research.startTime && now <= research.endTime) { // 进行中
            if (researchRecord.status === 0) {
                this.options.closeText = '下次再答';
            }
        } else if (now >= research.endTime) { // 已结束
            if (researchRecord.status === 0) {
                this.options.title = '温馨提示';
                content = '您好，该调研已过期，无法参与，谢谢';
            }
        }
        return {
            content: content
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

exports.buttons = function() {
    var researchRecord = this.bindings.researchRecord.data,
        research = this.bindings.researchRecord.data.researchQuestionary,
        now = new Date().getTime(),
        buttons = [],
        detailBtn = {
            text: '查看详情',
            fn: function() {
                var url = '#/exam/research-activity/research-answer/' + researchRecord.id;
                window.open(url, '_blank');
            }
        },
        beginBtn = {
            text: '开始答题',
            fn: function() {
                var url = '#/exam/research-activity/research-detail/' + research.id + '/' + research.id;
                window.open(url, '_blank');
            }
        };

    if (!researchRecord.id || research.startTime > now) { // 没有权限
        return buttons;
    } else if (now >= research.startTime && now <= research.endTime) { // 进行中
        if (researchRecord.status === 0) {
            buttons.push(beginBtn);
        } else {
            buttons.push(detailBtn);
        }
    } else if (now >= research.endTime) { // 已结束
        if (researchRecord.status === 1) {
            buttons.push(detailBtn);
        }
    }
    return buttons;
};

