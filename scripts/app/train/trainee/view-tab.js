var $ = require('jquery');

exports.bindings = {
    state: true
};

exports.events = {
    'click tab-*': 'showTab'
};

exports.handlers = {
    showTab: function(tab) {
        var state = this.bindings.state,
            classId = state.data.classId,
            isAutoApprove = state.data.isAutoApprove,
            quotaType = state.data.quotaType,
            role = state.data.role,
            isOpen = state.data.isOpen;
        $(this.$('tab-' + tab)).addClass('active').siblings().removeClass('active');
        state.data = {};
        state.data.tab = tab || 'manage';
        state.data[tab] = true;
        state.data.classId = classId;
        state.data.isAutoApprove = isAutoApprove;
        state.data.quotaType = quotaType;
        state.data.role = role;
        state.data.isOpen = isOpen;
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
        if (state.data.tab === 'formal-trainee') {
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
        if (state.data.tab === 'informal-trainee') {
            return true;
        }
        return false;
    },
    isMessage: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'message') {
            return true;
        }
        return false;
    },
    haveMessage: function() {
        var state = this.bindings.state;
        if (state.data.role !== 4) {
            return true;
        }
        return false;
    }
};
