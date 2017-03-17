exports.items = {
    activeexpert: 'activeexpert',
    hottopic: 'hottopic'
};

exports.store = {
    models: {
        hottopicstate: {},
        // activeexpertstate: {}
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
