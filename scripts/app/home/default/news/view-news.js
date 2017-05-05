module.exports = {
    bindings: { newsList: true, state: true },
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
    },
    dataForTemplate: {
        moduleHomeConfig: function(data) {
            var moduleHomeConfig = data.moduleHomeConfig || {};
            moduleHomeConfig = this.module.renderOptions.moduleHomeConfig;
            return moduleHomeConfig;
        }
    }
};
