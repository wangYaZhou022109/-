exports.items = {
    'banner-notice': 'banner-notice'
};

exports.store = {
    models: {
        personPanels: {
            url: '../system/person-panel'
        },
        newsList: {
            url: '../system/home-news/person-panel'
        },
        tasks: {
            url: '../human/task'
        }
    },
    callbacks: {
        init: function(payload) {
            var personPanels = this.models.personPanels,
                tasks = this.models.tasks,
                newsList = this.models.newsList;
            personPanels.params.moduleConfigId = payload.id;
            newsList.params.configId = payload.homeConfigId;
            newsList.params.size = 5;
            tasks.params.page = 1;
            tasks.params.pageSize = 5;
            personPanels.clear();
            newsList.clear();
            tasks.clear();
            if (this.app.global.currentUser.organization) {
                return this.chain(
                    this.get(personPanels),
                    this.get(tasks)
                );
            }
            return this.chain(
                this.get(personPanels),
                this.get(newsList)
            );
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
