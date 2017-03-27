var _ = require('lodash/collection');
var $ = require('jquery');
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
        imgParse: { url: '../human/file/upload-parse-file' },
        img: {
            url: '../system/file/upload'
        },
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
        },
        question: { url: '../ask-bar/question/insert-question' }
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
            var question = this.models.question;
            data.enclosureUrl = 'null';
            data.enclosureName = 'null';
            data.enclosureType = -1;
            data.enclosureSuffix = 'null';
            data.transferViewUrl = 'null';
            data.transferFlag = -1;
            data.enclosureSuffixImg = 'null';
            if (task.attachments) {
                // console.log(task);
                data.enclosureUrl = task.attachments[0].attachmentId;
                data.enclosureName = task.attachments[0].name;
                data.enclosureType = task.attachments[0].idex;
                data.enclosureSuffix = task.attachments[0].contentType;
                data.transferViewUrl = 'null';
                data.transferFlag = 1;
                data.enclosureSuffixImg = 'null';
            }
            data.speechset = speechset.status;
            data.id = '1';
           // data.topic = topic.toString();

            question.set(data);
            // console.log(question);
            this.post(question).then(function() {
                me.app.message.success('操作成功');
                // me.app.show('content', 'ask/content');
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            });
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

exports.title = '我要提问';

exports.buttons = [{
    text: '发布',
    fn: function(payload) {
        var stepView = this.items.edit;
        var str = stepView.getData();
        var img,
            begin,
            src,
            end,
            data = payload;
        data.jsonImg = 'null';
        if (str.indexOf('<img') !== -1) {
            begin = str.indexOf('<img');
            end = str.indexOf('/>');
            img = $(str.substring(begin, end + 2));
            src = img[0].src.split('/');
            data.jsonImg = src[src.length - 1];
        }
        data.content = str;
        return this.dispatch('release', data);
    }
}];
