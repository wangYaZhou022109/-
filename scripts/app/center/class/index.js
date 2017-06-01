exports.items = {
    main: 'main',
    'train/class-detail/class-bus': { isModule: true }
};

exports.store = {
    models: {
        classInfo: { url: '../train/class-info/find-my-class-info' },
        state: {}
    },
    callbacks: {
        init: function() {
            var state = this.models.state,
                classInfo = this.models.classInfo;
            state.data.tab = 0;
            state.changed();
            this.get(classInfo);
        },
        refreshList: function(paylaod) {
            var classInfo = this.models.classInfo;
            classInfo.params = { status: paylaod.status, name: paylaod.name };
            this.models.state.data.name = paylaod.name;
            this.get(classInfo);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
