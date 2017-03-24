var STAISFACTION = 'satisfaction';

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
                satisfaction: true,
                markpaper: false,
                homework: false
            });
        },
        switchMenu: function(payload) {
            this.models.state.set(payload);
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};

