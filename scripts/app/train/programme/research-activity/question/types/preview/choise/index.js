var maps = require('./app/util/maps'),
    D = require('drizzlejs'),
    NO_OPTIONS_SCORE = 0,
    _ = require('lodash/collection');

exports.items = {
    content: 'content',
    options: 'options'
};

exports.store = {
    models: {
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var data = this.models.state.data = {
                    options: [],
                    title: '单选题',
                    answer: '',
                    id: payload.data.id,
                    index: payload.data.index
                },
                i,
                question = payload.data,
                questionAttrs,
                difficultys = maps.get('question-difficultys'),
                types = maps.get('question-types');

            if (question) {
                D.assign(data, question);
                questionAttrs = question.questionAttrs;
                // questionAttrs 需要按照name排序，防止选项被打乱
                questionAttrs = _.sortBy(questionAttrs, 'name');
                for (i = 0; i < questionAttrs.length; i++) {
                    data.options.push({
                        content: questionAttrs[i].value,
                        score: questionAttrs[i].score || 0,
                        isAnswer: Number(questionAttrs[i].type) === 0,
                        isRichText: false
                    });
                    if (Number(questionAttrs[i].type) === 0) {
                        data.answer += String.fromCharCode(i + 'A'.charCodeAt(0));
                    }
                }
                data.score = question.score;
                data.content = question.content;
                if (question.difficulty) {
                    data.difficulty = difficultys[Number(question.difficulty) - 1].value;
                }
                data.type = types[Number(question.type) - 1].value;
                if (Number(question.type) === 2) data.title = '多选题';
            }
            if (!data.mode) {
                data.mode = payload.mode || NO_OPTIONS_SCORE;
            }
            this.models.state.changed();
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
