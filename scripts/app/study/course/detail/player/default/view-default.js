exports.bindings = {
    state: false
};

exports.events = {
    'click register': 'register'
};

exports.handlers = {
    register: function() {
        this.module.renderOptions.register();
    }
};

exports.dataForTemplate = {
    state: function(data) {
        return {
            loading: !data.state.state.id,
            error: data.state.state.id && !data.state.section
        };
    }
};
