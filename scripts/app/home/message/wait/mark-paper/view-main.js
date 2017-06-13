var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.bindings = {
    waitMarkPapers: true,
    state: true
};

exports.actions = {
    'click loadMore': 'loadMore'
};

exports.dataForTemplate = {
    waitMarkPapers: function(data) {
        if (data.state.wait === 1) {
            return _.map(_.filter(data.waitMarkPapers, function(p) {
                return p.examRecord.status === 5;
            }), function(pp) {
                return D.assign(pp, {
                    statusDec: pp.examRecord.status > 5 ? '已评卷' : '待评卷',
                    waitMark: pp.examRecord.status <= 5,
                    score: pp.examRecord.score / 100
                });
            });
        }
        return _.map(data.waitMarkPapers, function(p) {
            return D.assign(p, {
                statusDec: p.examRecord.status > 5 ? '已评卷' : '待评卷',
                waitMark: p.examRecord.status <= 5,
                score: p.examRecord.score / 100
            });
        });
    },
    showMore: function() { // 是否显示加载更多
        return 1;
    },
};

exports.events = {
    'click mark-*': 'showMarkPaper',
    'click waitTodo-*': 'waitTodo'
};

exports.handlers = {
    showMarkPaper: function(id) {
        var url = '#/exam/exam/mark-paper/' + id;
        window.open(url, '_blank');
    },
    waitTodo: function(id, target) {
        return this.module.dispatch('waitTodo', {
            wait: target.target.checked ? 1 : 0
        });
    }
};
