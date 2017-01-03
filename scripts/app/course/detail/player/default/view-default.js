exports.bindings = {
    course: true
};

exports.actions = {
    'click register': 'register'
};

exports.actionCallbacks = {
    register: function(data) {
        this.module.renderOptions.refresh.call(this, data[0]);
    }
};
