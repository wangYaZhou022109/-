exports.bindings = {
    state: true
};

exports.events = {
    'click identity-*': 'showIdentity',
    'click demand-side': 'showProjects',
    'click class-staff': 'showClassinfos'
};

exports.handlers = {
    showIdentity: function(menu) {
        var state = this.bindings.state;
        state.data = {};
        state.data.menu = menu;
        state.data[menu] = true;
        state.changed();
    },
    showProjects: function() {
        var model = this.module.items['person/index/projects'];
        this.app.viewport.modal(model);
    },
    showClassinfos: function() {
        var model = this.module.items['person/index/classinfos'];
        this.app.viewport.modal(model);
    }
};
