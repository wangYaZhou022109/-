var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.items = {
    content: 'content',
    score: 'score'
};

exports.store = {
    models: {
        state: {
            data: {},
            mixin: {
                patch: function(target, source) {
                    var t = new RegExp(target, 'g'),
                        match;
                    if (source === '') return true;
                    match = source.match(t);
                    return match ? match.length : false;
                }
            }
        },
        img: { url: '../system/file/upload' }
    },
    callbacks: {
        init: function(payload) {
            var question = payload.data,
                state = this.models.state,
                data = state.data;

            if (question) {
                data.answer = _.map(question.questionAttrs, function(q) {
                    return q.value;
                }).join('|');
                D.assign(data, question);
            }
        }
    }
};

exports.mixin = {
    getValue: function() {
        var view = this.items.content;
        if (!view.checkAnswer()) {
            return false;
        }
        return view.getResult();
    },
    isValidate: function() {
        return this.items.content.validate() && this.items.score.validate();
    },
    clear: function() {
        this.renderOptions = {};
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
