var $ = require('jquery');

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
        $(this.$('tab-' + tab)).addClass('active').siblings().removeClass('active');
        state.data = {};
        state.data.tab = tab || 'manage';
        state.data[tab] = true;
        state.data.classId = classId;
        state.data.isAutoApprove = isAutoApprove;
        state.data.quotaType = quotaType;
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
    },
    isMessage: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'message') {
            return true;
        }
        return false;
    },
};
