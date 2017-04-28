var _ = require('lodash/collection');

exports.type = 'dynamic';

exports.bindings = {
    paperClass: true,
    markConfig: true,
    exam: true
};

exports.getEntity = function() {
    return {
        paperClass: this.bindings.paperClass.data,
        markConfig: this.bindings.markConfig.data,
        exam: this.bindings.exam.data
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
                return type !== 4 && type !== 5 && type !== 6;
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
