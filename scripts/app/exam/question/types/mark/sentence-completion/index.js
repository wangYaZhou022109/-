var D = require('drizzlejs');

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: {},
        goal: {
            mixin: {
                init: function(data) {
                    this.data = data || { key: '', value: '' };
                }
            }
        }
    },

    callbacks: {
        init: function(payload) {
            var question = payload.data,
                data = this.models.state.data;
            D.assign(data, question, { answer: question.questionAttrs[0].value });
            this.models.goal.init(payload.goal);
            this.models.state.changed();
        },
        save: function() {
            var callback = this.module.renderOptions.callback,
                goal = this.models.goal.data;
            if (callback) callback(goal);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
