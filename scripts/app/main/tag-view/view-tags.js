exports.bindings = {
    state: true
};

// exports.type = 'form';

exports.dataForTemplate = {
    name: function() {
        return this.module.renderOptions.name;
    },

    emptyText: function() {
        return this.module.renderOptions.emptyText;
    },
    placeholder: function() {
        return this.module.renderOptions.placeholder || '';
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

exports.events = {
    'keyup addTopic': 'addTopic'
};

exports.handlers = {
    addTopic: function(e, element) {
        var pro = this.module.renderOptions.entryCallback;
        if (!pro || e.keyCode !== 13) return false;
        return pro(element.value);
    }
};
exports.afterRender = function() {
    var pro = this.module.renderOptions.changeCallback;
    var ids = this.module.getValue();
    if (pro) return pro(ids);
    return false;
};

