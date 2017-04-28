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
        state.data.tab = tab || 'classTwoBrings';
        state.data.classId = classId;
        state.data[tab] = true;
        state.changed();
    }
};

exports.dataForTemplate = {
    isManage: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'manage') {
            return true;
        }
        return false;
    },
    isFmtrainee: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'fmtrainee') {
            return true;
        }
        return false;
    },
    isClassstaff: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'classstaff') {
            return true;
        }
        return false;
    },
    isIftrainee: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'iftrainee') {
            return true;
        }
        return false;
    }
};
