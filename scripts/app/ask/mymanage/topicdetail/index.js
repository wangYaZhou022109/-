exports.items = {
    topicdetail: 'topicdetail',
    menu: 'menu',
    list: 'list',
    right: 'right'
};
exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        topicdetail: { url: '../ask-bar/my-manage/topicdeal' },
        state: { data: { menu: 'news' } }
    },
    callbacks: {
        init: function(paylaod) {
            var topicdetail = this.models.topicdetail;

            var state = this.models.state;
            state.data = {};
            state.data.menu = 'news';
            state.data.news = true;
            state.data.topicId = paylaod.id;
            state.changed();

            topicdetail.set({ id: paylaod.id });
            return this.get(topicdetail);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};
