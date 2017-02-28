exports.bindings = {
    onlineCourseList: true,
    state: true
};

exports.actions = {
    'click theme-online': 'showOnlineTheme'
};

exports.dataForActions = {

};

exports.actionCallbacks = {
    showOnlineTheme: function() {
        this.app.viewport.modal(this.module.items.configOnline);
    }
};

exports.dataForTemplate = {
    state: function() {
        var state = this.bindings.state.data;
        return state;
    }
};
