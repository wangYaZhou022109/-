exports.items = {

};

exports.store = {
    models: {
        projectInfo: { url: '../train/projectInfo' },
        state: {}
    },
    callbacks: {
        init: function() {
            var state = this.models.state;
            state.data.menu = 'book';
            state.data.book = true;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
