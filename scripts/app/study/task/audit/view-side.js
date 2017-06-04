var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    sectionStudyProgress: false,
    task: true,
    download: false,
    preview: false
};

exports.dataForTemplate = {
    task: function(data) {
        var task = data.task,
            me = this;
        _.map(task.attachments || [], function(attach) {
            var obj = attach;
            if (obj.contentType && obj.contentType === 1) {
                obj.preview = true;
            }
            obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
        });
        return task;
    },
    sectionStudyProgress: function(data) {
        var sectionStudyProgress = data.sectionStudyProgress,
            me = this;
        _.map(sectionStudyProgress.sectionAttachments || [], function(attach) {
            var obj = attach;
            if (obj.contentType && obj.contentType === 1) {
                obj.preview = true;
            }
            if (obj.attachmentId) {
                obj.downUrl = me.bindings.download.getFullUrl() + '?id=' + obj.attachmentId;
            }
        });
        return sectionStudyProgress;
    }
};

exports.events = {
    'click taskDescription': 'taskDescription',
    'click taskAttachment*': 'taskAttachment',
    'click sectionAttachment*': 'sectionAttachment',
    'click viewUseDesc-*': 'viewUseDesc'
};

exports.handlers = {
    taskDescription: function() {
        this.module.dispatch('updateState', {
            flag: 'desc',
            description: ''
        });
    },
    taskAttachment: function(id) {
        var attachUrl = this.bindings.preview.getFullUrl() + '/' + id,
            param = {
                flag: 'pdf',
                attachUrl: attachUrl
            };
        this.module.dispatch('updateState', param);
    },
    sectionAttachment: function(id) {
        var sectionAttachments = this.bindings.sectionStudyProgress.data.sectionAttachments || [],
            attachment = _.find(sectionAttachments, {
                id: id
            }),
            attachUrl = this.bindings.preview.getFullUrl() + '/' + attachment.attachmentId,
            param = {
                flag: 'pdf',
                attachUrl: attachUrl,
                description: ''
            };
        this.module.dispatch('updateState', param);
    },
    viewUseDesc: function(id) {
        var sectionAttachments = this.bindings.sectionStudyProgress.data.sectionAttachments || [],
            attachment = _.find(sectionAttachments, {
                id: id
            }),
            param = {
                flag: 'useDesc',
                attachUrl: '',
                description: attachment.description
            };
        this.module.dispatch('updateState', param);
    }
};

exports.mixin = {
    getData: function() {
        var auditPass = $(this.$$('input[name=auditPass]:checked')).val(),
            score = $(this.$$('input[name=score]')).val(),
            comments = $(this.$('comments')).val(),
            data = {
                auditPass: auditPass,
                score: score,
                comments: comments
            };
        if (!score) {
            this.app.message.error('请输入评分!');
            return false;
        } else if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(score)) {
            this.app.message.error('评分只能输入整数!');
            return false;
        } else if (comments.length > 3000) {
            this.app.message.error('评语内容过长，最大不超过3000字符!');
            return false;
        }
        return data;
    }
};
