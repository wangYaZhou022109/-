var _ = require('lodash/collection');
exports.title = '查找试卷';

exports.buttons = [{
    text: '确定',
    action: 'doSearch'
}];

exports.events = {
    'click search': 'showModal'
};

exports.handlers = {
    showModal: function() {
        this.app.viewport.modal(this.module.items.modal);
    }
};

exports.dataForActions = {
    doSearch: function(d) {
        return _.map(d, function(v, k) {
            return { type: k, id: v, text: v };
        });
    }
};
