var D = require('drizzlejs');
exports.bindings = {
    task: false,
    taskMember: true
};

exports.type = 'form';
exports.title = '提交任务';
exports.auto = true;

exports.buttons = [{
    text: '提交',
    action: 'submitTask'
}];

exports.events = {
    'click uploadFile': 'uploadFile',
};

exports.dataForActions = {
    submitTask: function(payload) {
        var taskMember = this.bindings.taskMember.data || [];
        if (!payload.name) {
            this.app.message.error('附件名称不能为空!');
            return false;
        } else if (!payload.description) {
            this.app.message.error('附件描述不能为空!');
            return false;
        }
        return payload;
    }
};

exports.handlers = {
    uploadFile: function() {
        this.app.viewport.modal(this.module.items.upload);
    }
};

exports.beforeClose = function() {
    this.bindings.taskMember.clear();
};
