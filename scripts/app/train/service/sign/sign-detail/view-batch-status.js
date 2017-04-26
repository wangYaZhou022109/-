var $ = require('jquery');

exports.title = '请选择您要变更的签到状态';

exports.type = 'form';

exports.small = true;

exports.bindings = {
    signDetail: true,
    state: true,
};

exports.buttons = [{
    text: '确定',
    action: 'batch',
}];

exports.actions = {
    'click batch': 'batch'
};

exports.dataForActions = {
    batch: function() {
        var ids = this.bindings.state.data.ids;
        return {
            ids: ids,
            state: $(this.$$('[name="state"]')).val(),
        };
    }
};

exports.actionCallbacks = {
    batch: function() {
        this.app.viewport.closeModal();
    }
};

exports.dataForTemplate = {
    state: function(data) {
        var lulu = data.state.ids;
        return lulu;
    }
};
