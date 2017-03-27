var _ = require('lodash/collection');

exports.items = {
    top: 'top',
    topic: 'topic',
    upload: '',
    edit: 'edit',
    details: 'details'
};
exports.store = {
    models: {
        state: { data: [] },
        task: { data: [] },
        trends: { url: '../ask-bar/trends' },
        imgParse: { url: '../human/file/upload-parse-file' },
        article: { url: '../ask-bar/question/insert-article' },
        img: { url: '../system/file/upload' },
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
        speech: {
            url: '../system/speech-set',
            mixin: {
                getData: function(id) {
                    var speechset;
                    _.forEach(this.data, function(d) {
                        if (d.id === id) {
                            speechset = d;
                        }
                    });
                    return speechset;
                }
            }
        }
    },
    callbacks: {
        addFile: function(payload) {
            var me = this,
                attachments = me.models.task.data.attachments || [];
            _.forEach(payload || [], function(data, i) {
                var obj = data,
                    index = i + 1;
                obj.idx = attachments.length + index;
                attachments.push(obj);
            });
            me.models.task.data.attachments = attachments;
            me.models.task.changed();
        },
        init: function() {
            var speech = this.models.speech;
            return this.get(speech);
        },
        initTopic: function() {
            var topicname = this.models.topicname;
            var state = this.models.state;
            state.clear();
            state.changed();
            return this.get(topicname);
        },
        release: function(payload) {
            var me = this,
                data = payload,
                task = me.models.task.data,
                speechset = this.models.speech.getData('1');
            var topicIds = this.models.state.data;
            var topic = [];
            this.models.article.set(payload);
            _.forEach(topicIds, function(d) {
                topic.push(d.id);
            });
            if (task.attachments) {
                data.enclosureUrl = task.attachments[0].attachmentId;
                data.enclosureName = task.attachments[0].name;
                data.enclosureType = task.attachments[0].idex;
                data.enclosureSuffix = task.attachments[0].contentType;
                data.transferViewUrl = '';
                data.transferFlag = 1;
                data.enclosureSuffixImg = '';
            }
            data.speechset = speechset.status;
            data.id = '1';
            data.topic = topic.toString();
            this.models.article.set(data);
            if (topic.length === 0) {
                this.app.message.success('请关联话题，操作失败！');
            }
            if (topic.length > 0) {
                this.post(this.models.article).then(function() {
                    me.app.message.success('操作成功');
                    // me.app.show('content', 'ask/content');
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                });
            }
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
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
    this.dispatch('initTopic');
};


exports.title = '发表文章';

exports.buttons = [{
    text: '发布',
    fn: function(data) {
        return this.dispatch('release', data);
    }
}];
