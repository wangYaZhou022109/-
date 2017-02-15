// exports.bindings = {
// };

// exports.dataForTemplate = {
// };


exports.type = 'dynamic';

exports.events = {
    'click closeCatalog': 'closeCatalog'
};

exports.handlers = {
    closeCatalog: function() {
        this.$$('.catalog-view')[0].hidden = true;
        this.$$('.shield')[0].hidden = true;
    }
};


exports.bindings = {
    popupstate: true
};

exports.getEntityModuleName = function(key) {
    if (key !== '') {
        this.module.items.popup.$$('.shield')[0].hidden = false;
        this.module.items.popup.$$('.catalog-view')[0].hidden = false;
    }
    return 'ask/' + key;
};
exports.getEntity = function() {
    return {
        state: this.bindings.popupstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
