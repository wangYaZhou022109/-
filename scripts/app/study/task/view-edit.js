var D = require('drizzlejs');
exports.bindings = {
    task: false,
    progress: true,
    img: false
};

exports.type = 'form';
exports.title = '提交作业';

exports.buttons = [{
    text: '提交',
    action: 'submitTask'
}];

exports.components = [{
    id: 'description',
    name: 'rich-text',
    options: {
        model: 'img',
        items: []
    }
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
        var params = payload,
            attachments = this.bindings.progress.data.sectionAttachments || [],
            desc = this.components.description.html();
        if (attachments.length === 0 && !desc) {
            this.app.message.error('附件名称、作业详情不能同时为空!');
            return false;
        } else if (!payload.name && !desc) {
            this.app.message.error('附件、作业详情不能同时为空!');
            return false;
        }
        params.description = desc;
        return payload;
    },
    uploadFile: function(payload) {
        var view = this.module.items.upload,
            progress = this.bindings.progress;
        progress.set(D.assign(progress.data, payload));
        this.app.viewport.modal(view);
        return false;
    }
};
