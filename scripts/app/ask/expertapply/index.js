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
                this.app.message.success('请选择您擅长话题！');
            }
            if (data.introduce === '') {
                this.app.message.success('请填写您的优势！');
            }
            if (data.introduce !== '') {
                innerExpert.set(data);
                this.post(innerExpert).then(function() {
                    me.app.message.success('申请已提交，等待管理员审核！');
                    me.module.dispatch('refresh');
                   // me.app.show('content', 'ask/expert');
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
    // console.log('this.renderOptions');
    // console.log(this.renderOptions.callback);
    // console.log(this.renderOptions.callback);
    this.dispatch('set', this.renderOptions.callback);
    this.dispatch('init');
    this.dispatch('findUser');
};

exports.title = '专家申请';

exports.buttons = [{
    text: '提交申请',
    fn: function(payload) {
        var introduce = payload.introduce.replace(/(^\s*)|(\s*$)/g, '');
        var topicIds = payload.topicIds;
        var length = 0;
        if (typeof topicIds === 'undefined' || topicIds === '') {
            this.app.message.success('请选择您擅长话题！');
            return false;
        }
        if (introduce === '') {
            this.app.message.success('请填写您的优势！');
            return false;
        }
        if (introduce.length > 0) {
            length = introduce.replace(/[\u0391-\uFFE5]/g, 'aa').length;
            if (length > 500) {
                this.app.message.success('你的优势描述不能超过500字-申请失败！');
                return false;
            }
        }

        return this.dispatch('saveInner', payload);
    }
}];
