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
        state: { data: { menu: 'news' } },
        topicname: { url: '../ask-bar/topic/topic-name' },
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
            // .then(function() {
            //     var topicname = this.models.topicname;
            // // topicname.params = { id: 5 };
            //     return this.get(topicname);
            // });
        },

    }
};
exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
    // this.dispatch('topicname');
};
