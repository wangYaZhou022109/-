exports.bindings = {
    state: true
};

exports.events = {
    'click tab-*': 'showTab'
};

exports.handlers = {
    showTab: function(tab) {
        var state = this.bindings.state;
        var classId = this.bindings.state.data.classId;
        state.data = {};
        state.data.tab = tab || 'manage';
        state.data[tab] = true;
        state.data.classId = classId;
        state.changed();
    }
};
