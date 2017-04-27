var $ = require('jquery');

exports.bindings = {
    state: true
};

exports.events = {
    'click tab-*': 'showTab'
};

exports.handlers = {
    // showTab: function(tab) {
    //     var state = this.bindings.state,
    //         classId = state.data.classId;
    //     state.data = {};
    //     state.data.tab = tab || 'sign';
    //     state.data.classId = classId;
    //     state.data[tab] = true;
    //     state.changed();
    // },
    showTab: function(tab) {
        var state = this.bindings.state;
        var classId = this.bindings.state.data.classId;
        $(this.$('tab-' + tab)).addClass('active').siblings().removeClass('active');
        state.data = {};
        state.data.tab = tab || 'sign';
        state.data[tab] = true;
        state.data.classId = classId;
        state.changed();
    }
};

exports.dataForTemplate = {
    isSign: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'sign') {
            return true;
        }
        return false;
    },
    isReward: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'reward') {
            return true;
        }
        return false;
    },
    isBus: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'bus') {
            return true;
        }
        return false;
    },
    isSettle: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'settle') {
            return true;
        }
        return false;
    },
    isAffiche: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'affiche') {
            return true;
        }
        return false;
    },
    isDiscuss: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'discuss') {
            return true;
        }
        return false;
    },
    isAlbum: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'album') {
            return true;
        }
        return false;
    },
    isViews: function() {
        var state = this.bindings.state;
        if (state.data.tab === 'views') {
            return true;
        }
        return false;
    },
};
