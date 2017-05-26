var RESEARCH_TYPE = 5;

exports.bindings = {
    research: true,
    researchRecord: false,
    down: false
};

exports.events = {
    'click do-research': 'doResearch'
};

exports.handlers = {
    doResearch: function() {
        var me = this;
        return this.module.dispatch('getRecordByResearch').then(function() {
            // 如果是一开始的直接进入答题页面，不需要弹窗
            var researchRecord = me.bindings.researchRecord.data,
                research = researchRecord.researchQuestionary,
                now = new Date().getTime(),
                url = '';
            // 正在进行中的调研直接进入答题（详情）界面咯
            if (researchRecord.id && now >= research.startTime && now <= research.endTime) { // 进行中
                if (researchRecord.status === 0) { // 未答题
                    url = '#/exam/research-activity/research-detail/' + research.id + '/' + research.id;
                    window.open(url, '_blank');
                } else {
                    url = '#/exam/research-activity/research-answer/' + researchRecord.id;
                    window.open(url, '_blank');
                }
            } else {
                me.app.viewport.modal(me.module.items['research-tips']);
            }
        });
    }
};

exports.dataForTemplate = {
    img: function(data) {
        var downUrl = this.bindings.down.getFullUrl(),
            defultImg = 'images/default-cover/default_survey.jpg',
            research = data.research;
        return research.coverId ? (downUrl + '?id=' + research.coverId) : defultImg;
    }
};

exports.components = [function() {
    var data = {},
        research = this.bindings.research.data;
    if (research) {
        data.id = research.id;
        data.type = RESEARCH_TYPE;
        data.pics = research.coverId;
        data.title = research.name;
    }
    return {
        id: 'share',
        name: 'picker',
        options: {
            picker: 'share',
            data: data
        }
    };
}];
