var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.bindings = {
    research: true,
    dimensions: true
};

exports.dataForTemplate = {
    dimensions: function(data) {
        var questionTypes = maps.get('research-question-types'),
            chineseNumber = maps.get('chineseNumber');

        return _.map(data.research.dimensions, function(d, i) {
            return D.assign(d, {
                dimensionIndex: _.find(chineseNumber, ['key', (i + 1).toString()]).value,
                questions: _.map(d.questions, function(q, n) {
                    return D.assign(q, {
                        questionIndex: n + 1,
                        typeDesc: _.find(questionTypes, ['key', q.type.toString()]).value + '题'
                    });
                })
            });
        });
    }
};

exports.events = {
    'click q-*': 'selectQuestion',
    'click questionaryDetail': 'questionaryDetail'
};

exports.handlers = {
    selectQuestion: function(id) {
        return this.module.dispatch('selectQuestion', { id: id });
    },
    questionaryDetail: function() {
        return this.app.viewport.modal(this.module.items.description);
    }
};

