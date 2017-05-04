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
        task: { data: [{ sectionAttachments: 222 }] },
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
                attachments = payload;
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
                data.enclosureType = 1;
                data.enclosureSuffix = task.attachments[0].contentType;
                data.transferViewUrl = task.attachments[0].attachmentId;
                data.transferFlag = 1;
                data.enclosureSuffixImg = 'null';
            }
            data.speechset = speechset.status;
            data.id = '1';
            article.set(data);
            this.post(article).then(function() {
                me.app.message.success('操作成功');
                // setTimeout(function() {
                //     me.app.show('content', 'ask/content');
                // }, 2000);
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};


exports.title = '写文章';

exports.buttons = [{
    text: '发布',
    fn: function(payload) {
        var title = payload.title;
        var topicIds = payload.topicIds;
        var stepView = this.items.edit;
        var obj = stepView.getData();
        var content = obj.html();
        var img,
            begin,
            end,
            data = payload;
        title = title.replace(/(^\s*)|(\s*$)/g, '');
        if (typeof title === 'undefined' || title === '') {
            this.app.message.success('请填写文章标题！');
            return false;
        }
        if (typeof topicIds === 'undefined' || topicIds === '') {
            data.topicIds = 'null';
        }
        data.jsonImg = 'null';
        if (typeof content === 'undefined' || content === '') {
            data.content = 'null';
            data.content_txt = 'null';
        } else {
            if (content.indexOf('<img') !== -1) {
                begin = content.indexOf('<img');
                end = content.indexOf('/>');
                img = $(content.substring(begin, end + 2));
                data.jsonImg = img[0].src;
            }
            data.content = content;
            data.content_txt = obj.text();
        }
        return this.dispatch('release', data);
    }
}];
