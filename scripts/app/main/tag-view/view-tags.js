exports.bindings = {
    state: true
};

exports.type = 'form';

exports.dataForTemplate = {
    name: function() {
        return this.module.renderOptions.name;
    },

    emptyText: function() {
        return this.module.renderOptions.emptyText;
    },

    values: function() {
        return this.module.getValue();
    },

    tags: function(data) {
        return data.state.list;
    }
};

exports.actions = {
    'click remove-*': 'remove'
};

exports.dataForActions = {
    remove: function(data) {
        return { values: [data['tag-view-remove']] };
    }
};
