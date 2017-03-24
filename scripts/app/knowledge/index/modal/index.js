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
            var opt = { source: 5 };
            D.assign(opt, payload);
            model.set(opt);
            return this.save(model);
        }
    }
};

exports.title = '上传知识';
exports.buttons = [
    { text: '保存',
        fn: function(data) {
            var me = this;
            return this.dispatch('save', data).then(function() {
                me.app.message.success('上传成功，等待审核');
            });
        }
    }
];
