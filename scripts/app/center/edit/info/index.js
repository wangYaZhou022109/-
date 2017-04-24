
exports.items = {
    main: 'main',
};


exports.store = {
    models: {
        member: {},
        topicList: { url: '../system/topic/my-topic', autoLoad: 'after' }
    },
    callbacks: {
        init: function() {
        },
    }
};

exports.beforeRender = function() {
    this.store.models.member.set(this.renderOptions.member);
};
