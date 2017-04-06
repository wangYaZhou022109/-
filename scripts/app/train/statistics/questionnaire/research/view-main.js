var _ = require('lodash/collection');

exports.bindings = {
    researchQuestionarys: true
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'researchQuestionarys' }
}];

exports.dataForTemplate = {
    researchQuestionarys: function(data) {
        var researchQuestionarys = data.researchQuestionarys,
            pageNum = this.bindings.researchQuestionarys.getPageInfo().page;
        _.map(researchQuestionarys || [], function(researchQuestionary, i) {
            var e = researchQuestionary;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return researchQuestionarys;
    }
};

exports.events = {
    'click edit-researchQuestionarys*': 'edit'
};

exports.handlers = {
    edit: function(data) {
        var id = data,
            url = '#/exam/research-activity/research-detail/' + id;
        window.open(url, '_blank');
    }
};
