var D = require('drizzlejs'),
    _ = require('lodash/collection');
exports.bindings = {
    classInfo: true
};

exports.events = {
    'click satisfaction-*': 'showStatisfaction',
    'click toExam-*': 'toExam'
};

exports.dataForTemplate = {
    classInfo: function(data) {
        return _.map(data.classInfo, function(c) {
            var busList = c.busList,
                classEvaluate = c.classEvaluate,
                nowDate = (new Date()).getTime();
            busList = _.map(busList, function(b) {
                if (b.endTime > nowDate) {
                    return D.assign(b, { size: 1 });
                }
                return b;
            });
            classEvaluate = _.map(classEvaluate, function(e) {
                if (e.endTime > nowDate) {
                    return D.assign(e, { pass: 1 });
                }
                return e;
            });
            return D.assign(c, { busList: busList, classEvaluate: classEvaluate });
        });
    }
};

exports.handlers = {
    showStatisfaction: function(id) {
        var url = '#/train/service/views/research-detail/' + id;
        window.open(url, '_blank');
    },
    toExam: function(resourceId) {
        var url = '#/exam/exam/paper/' + resourceId;
        window.open(url, '_blank');
    }
};

