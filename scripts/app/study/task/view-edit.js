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
        if (!payload.name) {
            this.app.message.error('附件名称不能为空!');
            return false;
        } else if (!payload.description) {
            this.app.message.error('附件描述不能为空!');
            return false;
        } else if (attachments.length === 0) {
            this.app.message.error('请上传附件!');
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
