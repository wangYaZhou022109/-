var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    covert = require('./app/train/programme/exam/markConfigCovert'),
    getMarkType;

exports.items = {
    main: 'main',
    'train/programme/select-member': { isModule: true, uri: 'train/programme' }
};

exports.store = {
    models: {
        state: {
            mixin: {
                reset: function() {
                    _.forEach(this.data.markPapers, function(i) {
                        var item = i;
                        item.markMembers = [];
                    });
                    _.forEach(this.data.markQuestionTypes, function(i) {
                        var item = i;
                        item.markMembers = [];
                    });
                    _.forEach(this.data.markQuestions, function(i) {
                        var item = i;
                        item.markMembers = [];
                    });
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var data = payload.data,
                paperClass = data.paperClass,
                markConfig = data.markConfig,
                state = this.models.state;
            if (paperClass) {
                if (markConfig) {
                    state.set(covert.covertMarkConfig(markConfig, paperClass));
                    state.data.markType = getMarkType(markConfig);
                    state.data.isPaper = state.data.markType === 1;
                    state.data.isQuestionType = state.data.markType === 2;
                    state.data.isQuestion = state.data.markType === 3;
                    this.module.renderOptions.callback(this.module.getValue());
                } else {
                    state.set(covert.getRemoteMarkConfig(paperClass));
                    state.data.markType = 1;
                }
            }
            state.data.anonymityMark = data.exam.anonymityMark;
        },
        reload: function() {
            this.module.renderOptions.callback(this.module.getValue());
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    getValue: function() {
        var state = this.store.models.state.data,
            result;
        switch (state.markType) {
        case 1:
            result = { markPapers: state.markPapers };
            break;
        case 2:
            result = { markQuestionTypes: state.markQuestionTypes };
            break;
        case 3:
            result = { markQuestions: state.markQuestions };
            break;
        default:
            break;
        }
        return JSON.stringify(result);
    }
};

getMarkType = function(markConfig) {
    var data,
        type;
    if (D.isString(markConfig)) {
        data = JSON.parse(markConfig);
        _.forEach(data, function(v, k) {
            if (k === 'markPapers') type = 1;
            if (k === 'markQuestionTypes') type = 2;
            if (k === 'markQuestions') type = 3;
        });
        return type;
    }

    if (D.isArray(markConfig) && markConfig.length) {
        return markConfig[0].type;
    }

    return 1;
};
