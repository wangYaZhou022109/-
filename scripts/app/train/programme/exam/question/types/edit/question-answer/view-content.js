var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

// exports.type = 'form';

exports.bindings = {
    img: true,
    state: false
};

exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}, {
    id: 'answer',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}, {
    id: 'difficulty',
    name: 'selectize'
}];

exports.mixin = {
    getResult: function() {
        var data = {},
            value = this.components.answer.html(),
            scoreItem = this.module.items.score,
            state = this.bindings.state.data;
        data.questionAttrs = [{ value: value, name: value, type: 5 }];
        data.content = this.components.content.html();
        if (!this.module.renderOptions.hideScore) {
            data.score = scoreItem.$('score').value;
        }
        data.type = state.type;
        data.id = state.id;
        if (this.module.renderOptions.editMode === 2) {
            data.difficulty = this.$('difficulty').value;
        }
        return data;
    },
    validate: function() {
        var content = $(this.$('content')),
            difficulty = $(this.$('difficulty')),
            components = this.components.content.html(),
            ans = this.components.answer.html(),
            answer = $(this.$('answer')),
            flag = true;

        markers.text.valid(content);
        markers.text.valid(difficulty);

        if (components === '') {
            markers.text.invalid(content, validators.required.message);
            flag = false;
        }

        if (!validators.maxLength.fn(components, 3000)) {
            markers.text.invalid(content, '最大长度为3000');
            flag = false;
        }

        if (!ans) {
            markers.text.invalid(answer, validators.required.message);
            flag = false;
        }

        if (difficulty.val() === '') {
            markers.text.invalid(difficulty, validators.required.message);
            flag = false;
        }
        return flag;
    }
};

exports.dataForTemplate = {
    showDiffculty: function() {
        return this.module.renderOptions.editMode === 2;
    },
    difficultys: function(data) {
        var difficultys = maps.get('question-difficultys');
        if (data.state) {
            _.map(difficultys, function(t) {
                var obj = t;
                if (Number(obj.key) === Number(data.state.difficulty)) {
                    obj.selected = true;
                }
            });
        }
        return difficultys;
    }
};

