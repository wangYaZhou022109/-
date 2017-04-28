var $ = require('jquery');

exports.type = 'form';

exports.small = true;

exports.bindings = {
    signDetail: true,
    state: true,
};

exports.buttons = [{
    text: '确定',
    action: 'update',
}];

exports.actions = {
    'click update': 'update'
};

exports.dataForActions = {
    update: function() {
        var id = this.bindings.state.data.id;
        return {
            id: id,
            state: $(this.$$('[name="state"]')).val(),
        };
    }
};

exports.actionCallbacks = {
    update: function() {
        this.app.viewport.closeModal();
    }
};

exports.dataForTemplate = {
    state: function(data) {
        var lulu = data.state.id;
        return lulu;
    }
};
