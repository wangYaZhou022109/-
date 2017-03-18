var C = require('./app/exam/exam/question/types/mark/checkScore');

exports.bindings = {
    state: true,
    goal: true
};

exports.events = {
    'change goal': 'changeGoal',
    'keypress goal': 'keypressGoal'
};

exports.handlers = {
    changeGoal: function() {
        var goal = this.$('goal'),
            data = this.bindings.state.data,
            check = function(v, score) {
                if (C.isNull(v)) {
                    C.setError('请为该题目评分', this.$('error'), this.$('goal'));
                    return false;
                }

                if (C.isOverRange(v, score)) {
                    C.setError('分数超出范围', this.$('error'), this.$('goal'));
                    this.$('goal').value = '';
                    return false;
                }
                return true;
            };

        if (!check.call(this, goal.value, this.bindings.state.data.score)) {
            return false;
        }

        this.bindings.goal.data = {
            key: this.bindings.state.data.id,
            value: goal.value,
            type: this.bindings.state.data.type,
            isRight: Number(goal.value) === data.score ? 1 : 0
        };

        return this.module.dispatch('save');
    },
    keypressGoal: function(e) {
        var k = e.keyCode,
            goal = this.$('goal'),
            char = String.fromCharCode(k);

        if (!C.isInputNumber(k) || !C.isKeepOneDecimal(Number(goal.value + char))) {
            C.setError('非法输入， 只能输入数字，小数保留1位', this.$('error'), this.$('goal'));
            e.preventDefault();
            return false;
        }
        return true;
    }
};