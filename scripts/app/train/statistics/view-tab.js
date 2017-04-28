exports.bindings = {
    state: true
};

exports.events = {
    'click tab-*': 'showTab'
};

exports.handlers = {
    showTab: function(tab) {
        var state = this.bindings.state,
            classId = state.data.classId;
        state.data = {};
        state.data.tab = tab || 'questionnaire';
        state.data.classId = classId;
        state.data[tab] = true;
        state.changed();
    }
};

exports.dataForTemplate = {
    isManage: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'questionnaire') {
            return true;
        }
        return false;
    },
    isFmtrainee: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'class-two-brings') {
            return true;
        }
        return false;
    },
    isClassstaff: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'study-details') {
            return true;
        }
        return false;
    },
    isIftrainee: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'task') {
            return true;
        }
        return false;
    }
};
