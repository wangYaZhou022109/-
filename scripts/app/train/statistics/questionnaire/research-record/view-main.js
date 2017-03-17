var _ = require('lodash/collection');

exports.bindings = {
    researchQuestionarys: true,
    download: false,
    researchQuestionary: true
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
    },
    exportUrl: function() {
        var url = this.bindings.download.getFullUrl() + '?';
        var params = this.bindings.researchQuestionarys.params;
        var token = this.app.global.OAuth.token.access_token;
        params.pageSize = 100000;
        params.page = 1;
        _.map(params, function(v, k) {
            url += (k + '=' + v + '&');
        });
        url += ('access_token=' + token);
        return url;
    },
    researchQuestionary: function(data) {
        return data;
    }
};

exports.events = {
    'click edit_researchQuestionarys*': 'edit'
};

exports.handlers = {
    edit: function(id) {
        console.log(id);
        var mod = this.module.items['exam/research-activity/research-answer-detail'];
        this.app.viewport.ground(mod, {
            researchRecordId: id
        });
    }
};
