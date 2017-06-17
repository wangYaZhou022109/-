var STAISFACTION = 'mark-paper',
    D = require('drizzlejs');

exports.title = '待办';

exports.items = {
    label: 'label',
    content: 'content'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
            this.models.state.set({
                menu: STAISFACTION,
                satisfaction: false,
                markpaper: true,
                homework: false,
                wait: 0
            });
        },
        switchMenu: function(payload) {
            this.models.state.set(payload);
            this.models.state.changed();
        },
        waitTodo: function(payload) {
            D.assign(this.models.state.data, {
                wait: payload.wait,
                checked: payload.wait === 1
            });
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};

