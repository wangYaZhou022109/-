exports.title = '班车/订餐信息发布';

exports.bindings = {
    bus: true,
    optionList: true,
    state: false
};

exports.events = {
    'click addOption': 'addOption',
};

exports.handlers = {
    addOption: function() {
    }
};

exports.actions = {
    'click saveOption': 'saveOption'
};

exports.dataForActions = {

};

exports.actionCallbacks = {
    saveOption: function() {
        this.app.viewport.closeModal();
    }
};
