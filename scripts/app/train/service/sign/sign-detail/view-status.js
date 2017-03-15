var $ = require('jquery');

exports.title = '请选择您要变更的签到状态';

exports.type = 'form';

exports.bindings = {
    signDetail: true,
    state: true,
};

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
