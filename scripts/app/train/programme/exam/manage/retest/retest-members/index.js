exports.items = {
    main: 'main',
    'exam/exam/manage/retest/retest-members/select-member': { isModule: true }
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function(payload) {
            this.models.state.data = {
                tags: payload.data,
                latestExamId: payload.latestExamId
            };
        }
    }
};

exports.mixin = {
    getValue: function() {
        return this.items.main.components.tags.getValue();
    },
    getData: function() {
        return this.items.main.components.tags.getData();
    },
    validate: function() {
        var tags = this.items.main.components.tags;
        return tags.getData().length > 0;
    }
};
exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

