var _ = require('lodash/collection');
exports.items = {
    title: 'title',
    contents: 'contents'
};
exports.store = {
    models: {
        topicType: { url: '../system/topic-type' },
        submit: { url: '../ask-bar/expert-audit/insert' },
        topicname: {
            url: '../ask-bar/topic/topic-name',
            mixin: {
                searchLike: function(name) {
                    var data = [];
                    _.forEach(this.data, function(d) {
                        if (d.name.indexOf(name) !== -1) {
                            data.push(d);
                        }
                    });
                    return data;
                },
                getTopic: function(id) {
                    var data;
                    _.forEach(this.data, function(d) {
                        if (d.id === id) {
                            data = d;
                        }
                    });
                    return data;
                }
            }
        },
        checkOne: { url: '../ask-bar/topic/topic-name' },
        state: { data: [] }
    },
    callbacks: {
        init: function(payload) {
            var topicname = this.models.topicname;
            this.models.state.expertId = payload.id;
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
        searchLike: function(payload) {
            var like = payload.like;
            var data = this.models.topicname.searchLike(like);
            var topicname = this.models.topicname;
            topicname.clear();
            topicname.data = data;
            topicname.changed();
        },
        delTopic: function(payload) {
            var state = this.models.state;
            var newState = [];
            var data = payload;
            _.forEach(state.data, function(d) {
                if (d.id !== data.id) {
                    newState.push(d);
                }
            });
            state.data = newState;
            state.changed();
        },
        addTopic: function(payload) {
            var data = this.models.topicname.getTopic(payload.id);
            var state = this.models.state,
                falg = true;
            _.forEach(state.data, function(d) {
                if (d.id === data.id) {
                    falg = false;
                }
            });
            if (typeof data === 'object' && falg) {
                state.data.push(data);
                state.changed();
            }
        },
        submit: function() {
            var submit = this.models.submit;
            var topic = [],
                data = {},
                me = this;
            _.forEach(this.models.state.data, function(d) {
                topic.push(d.id);
            });
            if (topic.length === 0) {
                this.app.message.success('请选择您要变更的擅长话题！');
            }
            if (topic.length > 0) {
                data.id = this.models.state.expertId;
                data.newTopic = topic.toString();
                submit.set(data);
                return this.put(submit).then(function() {
                    me.app.message.success('操作成功');
                });
            }
            return null;
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
    this.dispatch('topicType', this.renderOptions);
};
exports.title = '选择话题';

exports.buttons = [{
    text: '选择',
    fn: function() {
        return this.dispatch('submit');
    }
}];
