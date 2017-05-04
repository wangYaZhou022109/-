var _ = require('lodash/collection'),
    maps = require('./app/util/maps');

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

