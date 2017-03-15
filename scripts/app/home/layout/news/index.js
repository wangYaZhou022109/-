module.exports = {
    items: { news: 'news' },
    beforeRender: function() {
        this.dispatch('init');
    },
    store: {
        models: {
            news: { url: '../system/news/list' },
            state: { data: { currentIndex: 0 } }
        },
        callbacks: {
            init: function() {
                return this.get(this.models.news);
            },
            changeIndex: function(num) {
                var current = this.models.state.data.currentIndex + num;
                if (this.models.news.data[current]) {
                    this.models.state.data.currentIndex = current;
                    this.models.state.changed();
                }
            }
        }
    }
};
