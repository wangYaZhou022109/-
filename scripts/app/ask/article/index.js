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
        release: function(payload) {
            var me = this,
                data = payload,
                task = me.models.task.data,
                speechset = this.models.speech.getData('1');
            var article = this.models.article;
            data.enclosureUrl = 'null';
            data.enclosureName = 'null';
            data.enclosureType = -1;
            data.enclosureSuffix = 'null';
            data.transferViewUrl = 'null';
            data.transferFlag = -1;
            data.enclosureSuffixImg = 'null';
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
            article.set(data);
            this.post(article).then(function() {
                me.app.message.success('操作成功');
                // me.app.show('content', 'ask/content');
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};


exports.title = '发表文章';

exports.buttons = [{
    text: '发布',
    fn: function(payload) {
        var stepView = this.items.edit;
        var str = stepView.getData();
        var img,
            begin,
            end,
            data = payload;
        data.jsonImg = 'null';
        if (str.indexOf('<img') !== -1) {
            begin = str.indexOf('<img');
            end = str.indexOf('/>');
            img = $(str.substring(begin, end + 2));
            data.jsonImg = img[0].src;
        }
        data.content = str;
        return this.dispatch('release', data);
    }
}];
