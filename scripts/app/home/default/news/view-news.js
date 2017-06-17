module.exports = {
    bindings: { newsList: true, state: true },
    events: {
        'click next': 'nextNews',
        'click pre': 'preNews',
        'click more-*': 'moreNews'
    },
    handlers: {
        nextNews: function() {
            this.module.dispatch('changeIndex', 1);
        },
        preNews: function() {
            this.module.dispatch('changeIndex', -1);
        },
        moreNews: function(id) {
            window.location.href = '#/news/index';
            this.app.navigate('news/index/' + id, true);
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
