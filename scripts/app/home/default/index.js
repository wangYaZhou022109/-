function getParams () {
    var params = {};
    window.location.search.substr(1).split('&').forEach(function(kv) {
        var kvarr = kv.split('=');
        params[kvarr[0]] = kvarr[1];
    });
    return params;
}

module.exports = {
    items: {
        'home/default/banner': { region: 'banner', isModule: true },
        'home/default/news': { region: 'news', isModule: true },
        main: 'main'
        // 'home/default/online-course': { region: 'online-course', isModule: true },
        // 'home/default/study-subject': { region: 'study-subject', isModule: true },
        // 'home/default/recommend-activity': { region: 'recommend-activity', isModule: true },
        // 'home/default/lecture': { region: 'lecture', isModule: true },
        // 'home/default/ranking': { region: 'ranklist', isModule: true }
    },
    beforeRender: function() {
        this.dispatch('init');
    },
    store: {
        models: {
            modules: { url: '../system/home-module' }
        },
        callbacks: {
            init: function() {
                this.models.modules.params = {
                    homeConfigId: getParams().configid
                };
                return this.get(this.models.modules);
            }
        }
    }
};
