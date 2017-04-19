var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    WAIT_START = 1,
    WAIT_JOIN = 2,
    FINISHED = 3;

exports.bindings = {
    researchRecords: true,
    search: true,
    down: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'researchRecords' }
}];

exports.actions = {
    'click search': 'search'
};

exports.events = {
    'click do-research-*': 'showResearchPaper',
    'click item-*': 'search',
    'click view-detail-*': 'showResearchAnswerDetail'
};

exports.handlers = {
    showResearchPaper: function(id) {
        return this.module.dispatch('getResearchById', { id: id }).then(function(data) {
            var url = '#/exam/research-activity/index/' + data.id;
            window.open(url, '_blank');
        });
    },
    search: function(status) {
        return this.module.dispatch('search', {
            status: status,
            name: this.$('name').value
        });
    },
    showResearchAnswerDetail: function(id) {
        var url = '#/exam/research-activity/research-answer/' + id;
        window.open(url, '_blank');
    }
};

exports.dataForTemplate = {
    researchRecords: function(data) {
        var search = this.bindings.search.data,
            downUrl = this.bindings.down.getFullUrl(),
            defultImg = 'images/default-cover/default_survey.jpg';
        return _.map(data.researchRecords, function(r) {
            var status = '',
                imgUrl = r.researchQuestionary.coverId ? (downUrl + '?id=' + r.researchQuestionary.coverId) : defultImg;
            if (search.all) {
                if (r.researchQuestionary.startTime > new Date().getTime()) {
                    status = WAIT_START;
                } else if (r.status === 0) {
                    status = WAIT_JOIN;
                } else {
                    status = FINISHED;
                }
            }
            if (search.waitJoin) {
                status = WAIT_JOIN;
            }
            if (search.waitStart) {
                status = WAIT_START;
            }
            if (search.finished) {
                status = FINISHED;
            }
            return D.assign(r, { status: status, imgUrl: imgUrl });
        });
    }
};
