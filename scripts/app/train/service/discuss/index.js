exports.items = {
    comment: 'comment',
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            state.set(payload);
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.classId });
};
