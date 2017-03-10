exports.bindings = {
    leave: true,
    lea: false,
    state: {}
};

exports.components = [{
    id: 'pager',
    name: 'background-pager',
    options: { model: 'leave' }
}];

exports.events = {
};

exports.handlers = {
};

exports.actions = {
    'click approval*': 'approval',
};

exports.dataForActions = {
    approval: function(payload) {
        console.log(payload);
        this.app.viewport.modal(this.module.items.approval);
        return payload;
    },
};

exports.actionCallBacks = {

};

