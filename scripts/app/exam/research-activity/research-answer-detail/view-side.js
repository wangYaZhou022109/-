var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps');

exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    dimensions: function(data) {
        var questionTypes = maps.get('research-question-types'),
            chineseNumber = maps.get('chineseNumber');

        if (data.researchRecord.researchQuestionary) {
            return _.map(data.researchRecord.researchQuestionary.dimensions, function(d, i) {
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
        return [];
    }
};
