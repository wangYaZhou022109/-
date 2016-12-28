exports.bindings = {
    state: true,
    exam: false
};

exports.events = {
    'click submit': 'submit'
};

exports.handlers = {
    submit: function() {
        return this.module.dispatch('submit', { submitType: 'Hand' });
    }
};
