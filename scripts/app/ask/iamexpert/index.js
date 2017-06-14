
exports.items = {
    banner: 'banner',
    left: 'left',
    right: 'right',
    'ask/changetopic': { isModule: true },
    'ask/expert/right': { isModule: true },
    'ask/expert/editsummary': { isModule: true }
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert' },
        leftstate: { data: { menu: 'inviteanswer' } },
        down: { url: '../human/file/download' },
        rightstate: {}
    },
    callbacks: {
        refresh: function() {
            this.models.rightstate.changed();
        },
        init: function() {
            var expert = this.models.expert,
                state = this.models.leftstate;
            state.data.id = 'me';
            expert.set({ id: 'me' });
            this.get(expert);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
