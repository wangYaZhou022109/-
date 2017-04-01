exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        all: {
            url: '../train/questionnaire-survey/count-c',
        },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var all = this.models.all,
                classId = payload.state.data.classId;
            all.params = { classId: classId };
            return this.get(all);
        },
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions);
};

