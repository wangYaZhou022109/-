var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    check;

exports.items = {
    main: 'main',
    mark: 'mark',
    'train/programme/exam/paper/select-paper': { isModule: true },
    'train/programme/exam/paper/preview-paper': { isModule: true },
    'train/programme/exam/paper/add-paper': { isModule: true },
    'train/programme/exam/question/random-question': {
        isModule: true
    }
};

exports.store = {
    models: {
        exam: {},
        paperClass: { url: '../exam/paper-class' },
        markConfig: {
            mixin: {
                getRemoteMarkConfig: function(markConfigs) {
                    return _.filter(markConfigs, ['examRoomId', null]);
                }
            }
        }
    },
    callbacks: {
        selectPaperId: function(id) {
            this.models.paperClass.clear();
            D.assign(this.models.paperClass.params, { paperId: id });
            return this.get(this.models.paperClass);
        },
        selectPaper: function(paper) {
            this.models.paperClass.data = paper;
            this.models.paperClass.changed();
        }
    }
};

exports.beforeRender = function() {
    var exam = this.renderOptions.exam,
        markConfig = this.store.models.markConfig,
        mc = exam.markConfig || exam.markConfigs;
    markConfig.set(mc);
    this.store.models.exam.set(exam);
    this.store.models.paperClass.set(exam.paperClass || {});
};

exports.mixin = {
    getData: function() {
        var paper = this.store.models.paperClass.data,
            markConfig = this.store.models.markConfig.data;
        if (paper && paper.id) {
            return {
                paperClass: paper,
                markConfig: markConfig,
                anonymityMark: '0'
            };
        }
        return null;
    },
    isValidator: function() {
        var scoreValid = function() {
            var paper = this.store.models.paperClass.data;
            var exam = this.store.models.exam.data;
            var passScore = exam.passScore * 100;
            if (passScore > paper.totalScore) {
                this.app.message.error('及格分数不得大于试卷总分');
                return false;
            }
            return true;
        };
        return this.items.main.validate() && check.call(this) && scoreValid.call(this);
    }
};

check = function() {
    var isSubjective = this.store.models.paperClass.data.isSubjective,
        markConfig = this.store.models.markConfig.data,
        hasMarkMembers = function(mc) {
            var mcObj;
            if (!mc) return false;
            if (typeof mc === 'string') {
                mcObj = JSON.parse(mc);
                return mcObj.markPapers[0].markMembers.length > 0;
            }
            return true;
        };
    if (Number(isSubjective) === 1 && !hasMarkMembers(markConfig)) {
        this.app.message.error('试卷存在主观题，必须选择评卷老师');
        return false;
    }
    return true;
};
