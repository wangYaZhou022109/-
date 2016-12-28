exports.bindings = {
    course: true
};

exports.actions = {
    'click register': 'register'
};

exports.actionCallbacks = {
    register: function() {
        this.module.renderOptions.refresh.call(this);
    }
};
