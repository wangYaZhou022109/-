var validator = require('./app/ext/views/form/validators'),
    markers = require('./app/ext/views/form/markers'),
    $ = require('jquery');

exports.bindings = {
    state: true,
    goal: true
};

exports.events = {
    'change goal': 'changeGoal'
};

exports.handlers = {
    changeGoal: function() {
        var goal = this.$('goal'),
            data = this.bindings.state.data,
            check;

        markers.text.valid($(goal));
        $(this.$('error')).html('');
        check = this.check();
        if (!check.check) {
            markers.text.invalid($(goal));
            this.app.message.error(check.error);
            $(this.$('error')).html(check.error);
        }

        this.bindings.goal.data = {
            key: this.bindings.state.data.id,
            value: goal.value,
            type: this.bindings.state.data.type,
            isRight: Number(goal.value) === data.score ? 1 : 0
        };

        return this.chain(
            this.module.dispatch('error', check),
            this.module.dispatch('save')
        );
    }
};

exports.mixin = {
    check: function() {
        var state = this.bindings.state.data,
            value = this.$('goal').value,
            check = true,
            error = [];

        if (!validator.required.fn(value)) {
            error.push(validator.required.message);
            check = false;
        }

        if (!validator.number.fn(value)) {
            error.push(validator.number.message);
            check = false;
            check = false;
        }

        if (!validator.keepDecimal.fn(value, 1)) {
            error.push(validator.keepDecimal.message);
            check = false;
        }

        if (!validator.range.fn(value, 0, state.score)) {
            error.push('超出分数范围');
            check = false;
        }

        return {
            check: check,
            error: error.join(','),
            id: state.id,
            content: state.content
        };
    }
};
