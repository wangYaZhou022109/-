// var _ = require('lodash/collection'),
//     D = require('drizzlejs');

exports.bindings = {
    researchRecords: true,
    search: true
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

// exports.dataForTemplate = {
//     researchRecords: function(data) {
//         var search = this.bindings.search.data;
//         return _.map(data.researchRecords, function(r) {
//             var status = '';
//             if (search.all) {
//                 if (r.researchQuestionary.startTime < new Date().getTime()) {
//                     status = '待开始';
//                 } else if (r.status === 0) {
//                     status = '待参加';
//                 } else {
//                     status = '已完成';
//                 }
//             }
//             if (search.waitJoin) {
//                 status = '待参加';
//             }
//             if (search.waitStart) {
//                 status = '待开始';
//             }
//             if (search.finished) {
//                 status = '已完成';
//             }
//             return D.assign(r, { status: status });
//         });
//     }
// };
