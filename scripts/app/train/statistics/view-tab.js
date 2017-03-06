exports.bindings = {
    state: true
};

exports.events = {
    'click tab-*': 'showTab'
};

exports.handlers = {
    showTab: function(tab) {
        var state = this.bindings.state;
        state.data = {};
        state.data.tab = tab || 'classTwoBrings';
        state.data[tab] = true;
        state.changed();
    }
};
