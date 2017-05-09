var D = require('drizzlejs');
exports.bindings = {
    task: false,
    progress: true
};

exports.type = 'form';
exports.title = '提交作业';

exports.buttons = [{
    text: '提交',
    action: 'submitTask'
}];

exports.dataForTemplate = {
    attachment: function(data) {
        var attachments = data.progress.sectionAttachments || [];
        return attachments[0];
    }
};

exports.actions = {
    'click uploadFile': 'uploadFile',
};

exports.dataForActions = {
    submitTask: function(payload) {
        var attachments = this.bindings.progress.data.sectionAttachments || [];
        if (attachments.length === 0 && !payload.description) {
            this.app.message.error('附件名称、作业详情不能同时为空!');
            return false;
        } else if (!payload.name && !payload.description) {
            this.app.message.error('附件、作业详情不能同时为空!');
            return false;
        }
        return payload;
    },
    uploadFile: function(payload) {
        var view = this.module.items.upload,
            progress = this.bindings.progress;
        if (progress.data.attachments && progress.data.attachments.length >= 3) {
            this.app.message.error('最多只能添加一个附件!');
            return false;
        }
        progress.set(D.assign(progress.data, payload));
        this.app.viewport.modal(view);
        return false;
    }
};
