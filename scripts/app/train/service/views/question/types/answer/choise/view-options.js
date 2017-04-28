var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    $ = require('jquery');

exports.bindings = {
    state: true,
    answer: true
};

exports.dataForTemplate = {
    options: function() {
        var data = this.bindings.answer.data,
            me = this;
        _.map(this.bindings.state.data.options, function(ii, i) {
            var item = ii;
            item.index = i;
            item.code = String.fromCharCode(item.index + 'A'.charCodeAt(0));
            item.questionId = me.bindings.state.data.id;
            if (_.find(data.value, ['id', item.id])) item.checked = true;
        });
        return this.bindings.state.data.options;
    },
    isShowDetail: function() {
        var mode = this.bindings.state.data.detailMode;
        return mode && mode > 0;
    },
    state: function(data) {
        return D.assign(data.state, {
            errorRate: data.state.errorRate / 10000
        });
    }
};

exports.events = {
    'click check-*': 'check',
    'click radio-*': 'radio',
    'change input-idea-*': 'inputIdea'
};

exports.handlers = {
    check: function(index) {
        var data = this.bindings.answer.data,
            option = this.bindings.state.getOption(index),
            temp;
        if (this.$('check-' + index).checked) {
            data.key = this.bindings.state.data.id;
            data.value.push({
                id: option.id,
                value: option.name,
                score: option.score,
                idea: $(this.$$('[name="idea"]')).val()
            });
        } else {
            temp = _.reject(data.value, ['id', option.id]);
            this.bindings.answer.data = {
                key: this.bindings.state.data.id,
                value: temp
            };
        }
        return this.module.dispatch('save');
    },
    radio: function(index) {
        var data = this.bindings.answer.data,
            option = this.bindings.state.getOption(index),
            temp;
        if (index === '3' && $(this.$$('[name="idea"]')).val() === '' && this.$('radio-' + 3).checked) {
            this.app.message.alert('选择D选项，必须输入意见');
            data.key = this.bindings.state.data.id;
            data.value = [{
                id: option.id,
                value: option.name,
                score: option.score,
                idea: $(this.$$('[name="idea"]')).val() || ''
            }];
            return false;
        }
        if (this.$('radio-' + index).checked) {
            data.key = this.bindings.state.data.id;
            data.value = [{
                id: option.id,
                value: option.name,
                score: option.score,
                idea: $(this.$$('[name="idea"]')).val() || ''
            }];
        } else {
            temp = _.reject(data.value, ['id', option.id]);
            this.bindings.answer.data = temp;
        }
        return this.module.dispatch('save');
    },
    inputIdea: function() {
        var data = this.bindings.answer.data.value[0];
        data.idea = $(this.$$('[name="idea"]')).val() || '';
        return this.module.dispatch('save');
    }
};

exports.beforeRender = function() {
    var data = this.bindings.state.data;
    if (data.detailMode === 1) {
        data.isShowAnswer = true;
        data.isShowGainScore = true;
    }
    if (data.detailMode === 2) {
        data.isShowAnswer = false;
        data.isShowGainScore = true;
    } else if (data.detailMode === 3) {
        data.isShowAnswer = false;
        data.isShowGainScore = true;
        this.bindings.answer.data = {};
    }
};
