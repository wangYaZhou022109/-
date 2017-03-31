var D = require('drizzlejs');
exports.items = {
    main: 'main',
    upload: ''
};
exports.store = {
    models: {
        knowledge: { url: '../course-study/knowledge' },
        file: { url: '../human/file/upload-parse-file' }
    },
    callbacks: {
        save: function(payload) {
            var model = this.models.knowledge;
            model.set(payload);
            return this.save(model);
        }
    }
};

exports.title = '上传知识';
exports.buttons = [
    { text: '提交审核',
        fn: function(payload) {
            var me = this;
            var opt = { source: 5, createClient: 0, auditStatus: 0 };
            D.assign(opt, payload);
            return this.dispatch('save', opt).then(function() {
                me.app.message.success('上传成功，等待审核');
            });
        }
    }
];
