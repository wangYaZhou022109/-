var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    checkReading;

exports.type = 'dynamic';

exports.bindings = {
    paperClass: true,
    markConfig: true,
    exam: true
};

exports.getEntity = function() {
    var exam = this.bindings.exam.data,
        paperClass = this.bindings.paperClass.data;
    return {
        paperClass: D.assign(paperClass, { name: exam.name }),
        markConfig: this.bindings.markConfig.data,
        exam: exam
    };
};

exports.getEntityModuleName = function() {
    return 'train/programme/exam/mark-config';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: function(markConfig) {
            me.bindings.markConfig.data = markConfig;
        }
    };
};

exports.dataForTemplate = {
    hasSubjective: function() {
        var paperClass = this.bindings.paperClass.data;
        if (paperClass.paperClassQuestions && paperClass.paperClassQuestions.length > 0) {
            return !_.every(this.bindings.paperClass.data.paperClassQuestions, function(q) {
                var type = q.question && q.question.type;
                return (type !== 4 && type !== 5 && type !== 6)
                    || (type === 6 && checkReading(q.question));
            });
        }
        if (paperClass.paperClassTactics && paperClass.paperClassTactics.length > 0) {
            return !_.every(paperClass.paperClassTactics, function(pt) {
                return pt.type !== 4 && pt.type !== 5 && pt.type !== 6;
            });
        }
        return false;
    }
};

checkReading = function(reading) {
    if (reading.type === 6) {
        return _.every(reading.subs, function(sub) {
            return sub.type !== 5;
        });
    }
    return true;
};

