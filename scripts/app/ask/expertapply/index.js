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
        topicname: {
            url: '../ask-bar/topic/topic-name',
            mixin: {
                getTopic: function(id) {
                    var data = {};
                    _.forEach(this.data, function(d) {
                        if (d.id === id) {
                            data = d;
                        }
                    });
                    return data;
                }
            }
        },
        innerExpert: { url: '../ask-bar/expert/webinsert-inner' },
        findUser: { url: '../ask-bar/member/find' }
    },
    callbacks: {
        init: function() {
            var topicname = this.models.topicname;
            var state = this.models.state;
            state.clear();
            state.changed();
            return this.get(topicname);
        },
        saveInner: function(payload) {
            var innerExpert = this.models.innerExpert;
            var data = {};
            var me = this;
            var user = this.models.findUser.data;
            data.introduce = payload.introduce;
            data.headPortrait = payload.headPortrait;
            data.activeStatus = 0;
            data.memberId = user.id;
            data.topicIds = payload.topicIds;
            if (data.topicIds === '') {
                this.app.message.success('请填写您擅长话题！');
            }
            if (data.introduce === '') {
                this.app.message.success('请填写您的优势！');
            }
            if (data.introduce !== '') {
                innerExpert.set(data);
                this.post(innerExpert).then(function() {
                    me.app.message.success('专家申请成功！');
                });
            }
        },
        findUser: function() {
            var user = this.models.findUser;
            user.set({ id: 'me' });
            return this.put(user);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
    this.dispatch('findUser');
};

exports.title = '专家申请';

exports.buttons = [{
    text: '提交申请',
    fn: function(payload) {
        return this.dispatch('saveInner', payload);
    }
}];
