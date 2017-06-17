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
            var name = payload.name;
            var length = 0;
            var description = payload.description;
            var descLength = 0;
            var integral = payload.integral;
            var categoryId = payload.categoryId;
            var r = /^\+?[1-9][0-9]*$/;
            name = name.replace(/(^\s*)|(\s*$)/g, '');
            integral = integral.replace(/(^\s*)|(\s*$)/g, '');
            if (typeof name === 'undefined' || name === '') {
                this.app.message.error('请填写知识名称！');
                return false;
            }
            if (name.length > 0) {
                length = name.replace(/[\u0391-\uFFE5]/g, 'aa').length;
                if (length > 60) {
                    this.app.message.error('知识名称不能超过60字！');
                    return false;
                }
            }
            if (integral !== 'undefined' && integral !== '' && (!r.test(integral)
                || window.parseInt(integral, 10) >= 100)) {
                this.app.message.error('下载积分必须为小于100的正整数！');
                return false;
            }
            if (typeof categoryId === 'undefined' || categoryId === '') {
                this.app.message.error('请选择目录！');
                return false;
            }
            if (description.length > 0) {
                descLength = description.replace(/[\u0391-\uFFE5]/g, 'aa').length;
                if (descLength > 3000) {
                    this.app.message.error('知识简介不能超过3000字！');
                    return false;
                }
            }
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
