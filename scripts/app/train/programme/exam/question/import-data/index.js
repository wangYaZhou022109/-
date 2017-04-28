var _ = require('lodash/collection');

exports.items = {
    main: 'main',
    file: ''
};

exports.title = '导入';

exports.large = true;

exports.store = {
    models: {
        file: { url: '../human/file/upload-file' },
        importData: { url: '../exam/question/import' },
        exportQuestionTemplate: { url: '../exam/question/export' }
    },
    callbacks: {
        importData: function(payload) {
            var me = this;
            this.models.importData.set(payload);
            return this.post(this.models.importData).then(function() {
                var importData = me.models.importData.data,
                    callback = me.module.renderOptions.callback,
                    questions = JSON.parse(importData.data);

                if (callback) {
                    _.forEach(questions, function(q) {
                        callback(q);
                    });
                }

                if (importData.error === '1') {
                    importData.showErrorUrl = true;
                    me.models.importData.changed();
                    me.app.message.error('导入存在错误数据，请点击下载错误数据链接查看');
                } else {
                    me.app.message.success('导入成功');
                    me.app.viewport.closePopup();
                }
            });
        },
        displayErrorUrl: function() {
            this.models.importData.data.showErrorUrl = false;
            this.models.importData.changed();
        }
    }
};
