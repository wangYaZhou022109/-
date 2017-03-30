exports.items = {
    topicdetail: 'topicdetail',
    menu: 'menu',
    list: 'list',
    relevantexperts: 'relevantexperts',
    relatedquestions: 'relatedquestions',
    top: 'top',
};
exports.store = {
    models: {
        followcount: { data: { menu: 'followcount' } },
        relevantexperts: { data: { menu: 'relevantexperts' } },
        relatedquestions: { data: { menu: 'relatedquestions' } },
        params: { data: { isOverdue: '1' } },
        topicdetail: { url: '../ask-bar/my-manage/topicdeal' },
        state: { data: { menu: 'news' } }
    },
    callbacks: {
        init: function(paylaod) {
            var topicdetail = this.models.topicdetail;

            var state = this.models.state;
            // console.log(paylaod);
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
