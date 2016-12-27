module.exports = {
    items: { 'recommend-activity': 'recommend-activity' },
    beforeRender: function() {
        this.dispatch('init', this.renderOptions);
    },
    store: {
        models: {
            homeConfig: {},
            activity: { url: '../exam/activity/ids' },
            down: { url: '../human/file/download' }
        },
        callbacks: {
            init: function(mod) {
                var ids = [];
                this.models.homeConfig.data = mod;
                mod.items.forEach(function(item) {
                    ids.push(item.sourceId);
                });
                this.models.activity.params = {
                    ids: ids.join(',')
                };
                return ids.length && this.get(this.models.activity);
            }
        }
    }
};
