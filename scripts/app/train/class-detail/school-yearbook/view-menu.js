// var _ = require('lodash/collection');
exports.bindings = {
    menu: true
};
exports.events = {
    'click menu-*': 'menuBySelect',
};
exports.handlers = {
    menuBySelect: function(id) {
        this.module.dispatch('list', id);
    }
};
