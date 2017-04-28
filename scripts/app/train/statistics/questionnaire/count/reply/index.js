exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        all: {
            url: '../train/questionnaire-survey/count-zong',
        },
        state: { data: {} },
    },
    callbacks: {
        init: function() {
            var all = this.models.all;
            return this.get(all);
        },
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions);
};

