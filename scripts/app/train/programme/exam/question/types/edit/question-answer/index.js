var D = require('drizzlejs');

exports.items = {
    content: 'content',
    score: 'score'
};

exports.store = {
    models: {
        state: { data: {} },
        img: { url: '../system/file/upload' }
    },
    callbacks: {
        init: function(payload) {
            var question = payload.data,
                data = this.models.state.data;

            if (question) {
                data.answer = question.questionAttrs[0].value;
                D.assign(data, question);
            }
            data.type = this.module.renderOptions.type;
        }
    }
};

exports.mixin = {
    getValue: function() {
        return this.items.content.getResult();
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
