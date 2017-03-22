exports.items = {
    title: 'title',
    contents: 'contents'
};
exports.store = {
    models: {
        topicType: { url: '../system/topic-type' },
        topicname: { url: '../ask-bar/topic/topic-name' },
        checkOne: { url: '../ask-bar/topic/topic-name' },
        state: {}
    },
    callbacks: {
        init: function() {
            var topicname = this.models.topicname;
            return this.get(topicname);
        },
        topicType: function() {
            var topicType = this.models.topicType;
            return this.get(topicType);
        },
        checkOne: function(payload) {
            var topicname = this.models.topicname;
            var checkOne = this.models.checkOne;
            checkOne.params = payload;
            return this.get(checkOne).then(function() {
                topicname.clear();
                topicname.data = checkOne.data;
                topicname.changed();
            });
        },
        checkAll: function() {
            var topicname = this.models.topicname;
            return this.get(topicname);
        },
    }
};
exports.beforeRender = function() {
    this.dispatch('init');
    this.dispatch('topicType', this.renderOptions);
};
exports.title = '选择话题';

exports.buttons = [{
    text: '选择'
}];
