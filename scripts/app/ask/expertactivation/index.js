var _ = require('lodash/collection');
exports.items = {
    headfile: 'headfile',
    user: 'user',
    topic: 'topic',
    details: 'details'
};

exports.store = {
    models: {
        state: { data: [] },
        topicname: { url: '../ask-bar/topic/topic-name' },
        activation: { url: '../ask-bar/expert/webactivation-inner' },
        expert: { url: '../ask-bar/expert/findExpert' }
    },
    callbacks: {
        refresh: function() {
            this.models.callback();
        },
        set: function(payload) {
            // console.log(payload);
            this.models.callback = payload;
        },
        init: function() {
            var topicname = this.models.topicname;
            var state = this.models.state;
            state.clear();
            state.changed();
            return this.get(topicname);
        },
        saveInner: function(payload) {
            var activation = this.models.activation;
            var data = {};
            var topic = [];
            var me = this;
            var topicIds = this.models.state.data;
            var expert = this.models.expert.data;
            _.forEach(topicIds, function(d) {
                topic.push(d.id);
            });
            data.introduce = payload.introduce;
            data.headPortrait = payload.headPortrait;
            data.activeStatus = 0;
            data.memberId = expert.member.id;
            data.topicIds = topic.toString();

            if (data.introduce !== '') {
                activation.set(data);
                this.post(activation).then(function() {
                    me.app.message.success('激活申请成功！');
                    me.module.dispatch('refresh');
                });
            }
        },
        findExpert: function() {
            var expert = this.models.expert;
            var state = this.models.state;
            var me = this;
            expert.set({ id: 'me' });
            this.put(expert).then(function() {
                var topicList = me.models.expert.data.topicList;
                _.forEach(topicList, function(d) {
                    state.data.push(d);
                });
                state.changed();
            });
        }
    }
};

exports.afterRender = function() {
    // console.log(this.renderOptions.callback);
    this.dispatch('set', this.renderOptions.callback);
    this.dispatch('init');
    this.dispatch('findExpert');
};

exports.title = '专家激活';

exports.buttons = [{
    text: '提交申请',
    fn: function(payload) {
        var introduce = payload.introduce.replace(/(^\s*)|(\s*$)/g, '');
        if (introduce === '') {
            this.app.message.success('请填写您的优势！');
            return false;
        }
        return this.dispatch('saveInner', payload);
    }
}];
