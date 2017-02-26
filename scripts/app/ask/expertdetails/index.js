var _ = require('lodash/collection');
exports.items = {
    banner: 'banner',
    list: 'list'
};

exports.store = {
    models: {
        expert: { url: '../ask-bar/expert' },
        state: {
            data: {
                menu: 'expertsanswer'
            },
            mixin: {
                set: function(o) {
                    console.log(o);
                    this.module.store.models.state.data.id = 222;
                }
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var expert = this.models.expert;
            expert.set(payload);
            this.get(expert);
        }
    }
};

exports.afterRender = function() {
    this.store.models.state.set.call({ id: 'id' });
    return this.dispatch('init', this.renderOptions);
};
