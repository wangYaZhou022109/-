module.exports = {
    bindings: { news: true, state: true },
    events: {
        'click next': 'nextNews',
        'click pre': 'preNews'
    },
    handlers: {
        nextNews: function() {
            this.module.dispatch('changeIndex', 1);
        },
        preNews: function() {
            this.module.dispatch('changeIndex', -1);
        }
    }
};
