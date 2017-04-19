var D = require('drizzlejs');
var title = {
    add: '上传知识',
    edit: '编辑知识'
};
exports.items = {
    main: 'main',
    upload: ''
};
exports.store = {
    models: {
        knowledge: { url: '../course-study/knowledge' },
        file: { url: '../human/file/upload-parse-file' },
        state: {}
    },
    callbacks: {
        init: function(data) {
            var model = this.models.knowledge;
            model.clear();
            if (data) {
                model.set(data);
                this.get(model);
            }
        },
        save: function(payload) {
            var model = this.models.knowledge;
            var me = this;
            model.set(payload);
            if (model.data.id) {
                model.url = '../course-study/knowledge/' + model.data.id;
                return this.put(model);
            }
            return this.save(model).then(function() { // 清除缓存
                if (me.models.knowledge) {
                    me.models.knowledge.data = {};
                }
            });
        }
    }
};

exports.title = function() {
    if (this.renderOptions.state) {
        return title[this.renderOptions.state];
    }
    return '上传知识';
};

exports.buttons = [
    { text: '提交审核',
        fn: function(payload) {
            var me = this;
            var opt = { source: 5, createClient: 0, auditStatus: 0 };
            D.assign(opt, payload);
            return this.dispatch('save', opt).then(function() {
                if (opt.id) {
                    me.app.message.success('修改成功，等待审核');
                } else {
                    me.app.message.success('上传成功，等待审核');
                }
            });
        }
    }
];

exports.beforeRender = function() {
    if (this.renderOptions.data) {
        this.dispatch('init', this.renderOptions.data);
    }
};
