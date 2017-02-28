exports.items = {
    main: 'main',
    search: 'search'
};

exports.large = true;

exports.store = {
    models: {
        state: {},
        trainees: {
            url: '../train/trainee/response',
            type: 'pageable',
            root: 'items'
        }
    },
    callbacks: {
        init: function(payload) {
            var trainees = this.models.trainees,
                state = this.models.state;
            state.clear();
            state.data = payload;
            trainees.params = payload;
            return this.get(trainees);
        },
        search: function(payload) {
            var trainees = this.models.trainees;
            trainees.params = payload;
            return this.get(trainees);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.classId });
};
