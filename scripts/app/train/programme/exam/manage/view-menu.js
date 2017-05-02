var $ = require('jquery');

exports.bindings = {
    exam: true,
    state: true
};

exports.events = {
    'click menu-*': 'changeType'
};

exports.handlers = {
    changeType: function(type) {
        $(this.$('menu-' + type)).addClass('current').siblings().removeClass('current');
        this.bindings.state.data.menuId = type;
        return this.module.dispatch('refreshState');
    }
};

exports.dataForTemplate = {
    isSignUpExam: function() {
        return Number(this.bindings.exam.data.type) === 1;
    },
    active: function() {
        return {
            menu1: Number(this.bindings.state.data.menuId) === 1,
            menu2: Number(this.bindings.state.data.menuId) === 2,
            menu3: Number(this.bindings.state.data.menuId) === 3,
            menu4: Number(this.bindings.state.data.menuId) === 4,
            menu5: Number(this.bindings.state.data.menuId) === 5,
        };
    },
    subjective: function(data) {
        return data.exam.markConfigs && data.exam.markConfigs.length > 0;
    }
};
