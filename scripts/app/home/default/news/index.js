exports.items = {
    news: 'news'
};

exports.store = {
    models: {
        newsList: {
            url: '../system/home-news'
        },
        state: {
            data: {
                currentIndex: 0
            }
        }
    },
    callbacks: {
        init: function(payload) {
            var newsList = this.models.newsList;
            newsList.clear();
            newsList.params.moduleHomeConfigId = payload.id;
            return this.get(newsList);
        },
        changeIndex: function(num) {
            var current = this.models.state.data.currentIndex + num;
            if (this.models.newsList.data[current]) {
                this.models.state.data.currentIndex = current;
                this.models.state.changed();
            }
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
