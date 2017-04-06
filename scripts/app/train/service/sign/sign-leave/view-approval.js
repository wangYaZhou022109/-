var $ = require('jquery');

exports.title = '请假审批';

exports.bindings = {
    leave: true,
    lea: true,
};

exports.actions = {
    'click update': 'update'
};

exports.dataForActions = {
    update: function() {
        return {
            id: $(this.$$('[name="lulu"]')).val(),
            // id: $(this.$('id')).val(),
            state: $(this.$$('[name="state"]')).val(),
        };
    }
};

exports.actionCallbacks = {
    update: function() {
        this.app.viewport.closeModal();
    }
};

