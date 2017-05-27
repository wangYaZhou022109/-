var _ = require('lodash/collection');
var $ = require('jquery');
var sensitive = require('./app/util/sensitive');
exports.items = {
    top: 'top',
    topic: 'topic',
    upload: '',
    edit: 'edit',
    details: 'details',
    selectdrop: 'selectdrop'
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
        question: { url: '../ask-bar/question/insert-question' },
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
        }
    },
    callbacks: {
        addFile: function(payload) {
            var me = this,
                attachments = payload;
            me.models.task.data = attachments[0];
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
            var question = this.models.question;
            data.enclosureUrl = 'null';
            data.enclosureName = 'null';
            data.enclosureType = -1;
            data.enclosureSuffix = 'null';
            data.transferViewUrl = 'null';
            data.transferFlag = -1;
            data.enclosureSuffixImg = 'null';
            if (task) {
                data.enclosureType = 1;
                data.transferFlag = 1;
                data.enclosureSuffixImg = 'null';
                if (typeof data.attachmentId !== 'undefined') {
                    data.enclosureUrl = task.attachmentId;
                }
                if (typeof data.name !== 'undefined') {
                    data.enclosureName = task.name;
                }
                if (typeof data.contentType !== 'undefined') {
                    data.enclosureSuffix = task.contentType;
                }
                if (typeof data.attachmentId !== 'undefined') {
                    data.transferViewUrl = task.attachmentId;
                }
            }
            data.speechset = speechset.status;
            data.id = '1';
            question.set(data);
            this.post(question).then(function() {
                var message = '提问成功';
                var speech = me.models.speech.getData('1');
                if (speech.status === 1) {
                    message = '等待审核';
                }
                me.app.message.success(message);
                me.module.renderOptions.leftrefresh;
            });
        },
        selecttitle: function() {
            var selecttitle = this.models.selecttitle;
            selecttitle.set({
                id: 'null',
                size: 10000,
                type: 1
            });
            this.post(selecttitle);
        },
        // selectquestion: function() {
        //     // var data = payload;
        //     //     data.id = 1;
        //     // var selecttitle = this.models.selecttitle.getData(payload);
        //     // console.log(selecttitle);
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
    this.options.store.callbacks.leftrefresh = this.renderOptions.leftrefresh;
    this.options.store.callbacks.bottomsrefresh = this.renderOptions.bottomsrefresh;
    this.dispatch('selecttitle');
    this.dispatch('init');
};

exports.title = '提问题';

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
            data = payload,
            length = 0,
            contentLength = 0;
        title = title.replace(/(^\s*)|(\s*$)/g, '');
        if (typeof title === 'undefined' || title === '') {
            this.app.message.success('请填写问题标题！');
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

