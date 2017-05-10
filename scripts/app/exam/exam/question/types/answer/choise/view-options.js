var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.bindings = {
    state: true,
    answer: true
};

exports.dataForTemplate = {
    options: function(data) {
        var answer = data.answer,
            me = this;
        _.map(data.state.options, function(ii, i) {
            var item = ii;
            item.index = i;
            item.code = String.fromCharCode(item.index + 'A'.charCodeAt(0));
            item.questionId = me.bindings.state.data.id;
            item.isDisabled = data.state.detailMode > 0;
            if (_.find(answer.value, ['id', item.id])) item.checked = true;
        });
        return data.state.options;
    },
    isShowDetail: function() {
        var mode = this.bindings.state.data.detailMode;
        return mode && mode > 0 && mode < 4;
    },
    state: function(data) {
        return D.assign(data.state, {
            errorRate: data.state.errorRate / 10000
        });
    }
};

exports.events = {
    'click check-*': 'check',
    'click radio-*': 'radio'
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
        if (this.$('radio-' + index).checked) {
            data.key = this.bindings.state.data.id;
            data.value = [{
                id: option.id,
                value: option.name,
            }];
        } else {
            temp = _.reject(data.value, ['id', option.id]);
            this.bindings.answer.data = temp;
        }
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
