var _ = require('lodash/collection');
var sensitive = require('./app/util/sensitive');
exports.items = {
    askshare: 'askshare',
    top: 'top',
    topic: 'topic',
    edit: 'edit',
    selectdrop: 'selectdrop'
};

exports.store = {
    models: {
        state: { data: [] },
        img: {
            url: '../system/file/upload'
        },
        titledata: {
            data: [],
            mixin: {
                getData: function(id) {
                    var selecttitle = '';
                    _.forEach(this.data, function(d) {
                        if (d.id === id) {
                            selecttitle = d.title;
                        }
                    });
                    return selecttitle;
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
        question: { url: '../ask-bar/question/share-article' },
        selecttitle: {
            url: '../ask-bar/question/selecttitle',
            mixin: {
                getData: function(title) {
                    var selecttitle = [];
                    if (typeof title !== 'string'
                        || title === ''
                        || title === null) {
                        selecttitle = [];
                    } else {
                        _.forEach(this.data, function(d) {
                            if (d.title.indexOf(title) !== -1) {
                                selecttitle.push(d);
                            }
                        });
                    }
                    return selecttitle;
                }
            }
        }
    },
    callbacks: {
        init: function() {
            var speech = this.models.speech;
            return this.get(speech);
        },
        release: function(payload) {
            var me = this,
                data = payload,
                speechset = this.models.speech.getData('1');
            var question = this.models.question;
            var jsonImg = payload.coverImage;
            data.speechset = speechset.status;
            data.id = '1';
            data.shareObjectId = this.module.renderOptions.shareObjectId;
            data.shareType = this.module.renderOptions.shareType;
            if (typeof jsonImg === 'undefined' || jsonImg === '') {
                data.jsonImg = 'null';
            } else {
                data.jsonImg = jsonImg;
            }
            question.set(data);
            this.post(question).then(function() {
                var message = '分享成功';
                var speech = me.models.speech.getData('1');
                if (speech.status === 1) {
                    message = '等待审核';
                }
                me.app.message.success(message);
            });
        },
        selecttitle: function() {
            var selecttitle = this.models.selecttitle;
            selecttitle.set({
                id: 'null',
                size: 10000,
                type: 2
            });
            this.post(selecttitle);
        },
        selectquestion: function(payload) {
            var titledata = this.models.titledata;
            var selecttitle = this.models.selecttitle.getData(payload);
            titledata.clear();
            titledata.data = selecttitle;
            titledata.changed();
        },
        showSelectquestion: function(payload) {
            var title = payload;
            var titledata = this.models.titledata;
            var selecttitle = this.models.selecttitle.getData(title);
            this.models.titledata.clear();
            titledata.data = selecttitle;
            titledata.changed();
        }
    }
};

exports.afterRender = function() {
    this.dispatch('selecttitle');
    this.dispatch('init');
};

exports.title = '分享到问吧';

exports.buttons = [{
    text: '分享',
    fn: function(payload) {
        var title = payload.title;
        var topicIds = payload.topicIds;
        var stepView = this.items.edit;
        var obj = stepView.getData();
        var content = obj.html();
        var data = payload,
            length = 0,
            contentLength = 0;
        title = title.replace(/(^\s*)|(\s*$)/g, '');
        if (typeof title === 'undefined' || title === '') {
            this.app.message.success('请填写标题！');
            return false;
        }
        if (title.length > 0) {
            length = title.replace(/[\u0391-\uFFE5]/g, 'aa').length;
            if (length > 60) {
                this.app.message.success('标题不能超过60字-发布失败！');
                return false;
            }
        }
        if (content.length > 0) {
            contentLength = content.replace(/[\u0391-\uFFE5]/g, 'aa').length;
            if (contentLength > 3000) {
                this.app.message.success('详细描述不能超过3000字-发布失败！');
                return false;
            }
        }
        if (content && sensitive.judge(content) > 0) {
            this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
            return false;
        }
        if (sensitive.judge(title) > 0) {
            this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
            return false;
        }
        if (typeof topicIds === 'undefined' || topicIds === '') {
            data.topicIds = 'null';
        }
        if (typeof content === 'undefined' || content === '') {
            data.content = 'null';
            data.content_txt = 'null';
        } else {
            data.content = content;
            data.content_txt = obj.text();
        }

        return this.dispatch('release', data);
    }
}];

