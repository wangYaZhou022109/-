
exports.bindings = {
    projectInfo: true,
    state: true
};

exports.events = {
    'click menu-*': 'changeMenu'
};

exports.handlers = {
    changeMenu: function(menu) {
        var state = this.bindings.state,
            id = this.bindings.state.data.id;
        state.data = {};
        state.data.menu = menu || 'book';
        state.data[menu] = true;
        state.data.id = id;
        state.changed();
    }
};

exports.dataForTemplate = {

};
