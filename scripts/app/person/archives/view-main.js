exports.type = 'dynamic';

exports.bindings = {
    state: true
};

exports.getEntityModuleName = function(key) {
    return 'person/' + key;
};

exports.getEntity = function() {
    return {
        state: this.bindings.state.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};


exports.events = {
    'click detail-item-*': 'showDetail'
};

exports.handlers = {
    showDetail: function() {
        var model = this.module.items['person/archives/detail'];
        this.app.viewport.modal(model);
    }
};
