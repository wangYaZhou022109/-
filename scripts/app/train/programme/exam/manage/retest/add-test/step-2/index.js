exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        retest: {},
        exam: {}
    },
    callbacks: {
        init: function(payload) {
            this.models.retest.set(payload.retest);
            this.models.exam.set(payload.exam);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    getValue: function() {
        return this.items.main.getEntities()[0].getData();
    }
};
