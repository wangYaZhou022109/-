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
        var isAutoApprove = this.bindings.state.data.isAutoApprove;
        var quotaType = this.bindings.state.data.quotaType;
        state.data = {};
        state.data.tab = tab || 'manage';
        state.data[tab] = true;
        state.data.classId = classId;
        state.data.isAutoApprove = isAutoApprove;
        state.data.quotaType = quotaType;
        state.changed();
    }
};
