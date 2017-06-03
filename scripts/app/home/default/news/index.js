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
            newsList.params.size = 10;
            return this.get(newsList);
        },
        changeIndex: function(num) {
            var current = this.models.state.data.currentIndex + num,
                length = this.models.newsList.data.length;
            if (length === current) {
                current = 0;
            } else if (current < 0) {
                current = length + current;
            }
            if (this.models.newsList.data[current]) {
                this.models.state.data.currentIndex = current;
                this.models.state.changed();
            }
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions.moduleHomeConfig);
};
