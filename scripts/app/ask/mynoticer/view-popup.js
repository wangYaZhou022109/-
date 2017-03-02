
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
    var titleDiv = this.module.items.popup.$$('.title')[0],
        title = this.bindings.popupstate.data.title,
        path = key;
    titleDiv.innerHTML = title;
    if (this.bindings.popupstate.hidden) {
        this.module.items.popup.$$('.shield')[0].hidden = false;
        this.module.items.popup.$$('.catalog-view')[0].hidden = false;
    }
    if (typeof path === 'undefined') {
        path = 'mynotice/topic';
    }

    return 'ask/' + path;
};
exports.getEntity = function() {
    return {
        state: this.bindings.popupstate.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
