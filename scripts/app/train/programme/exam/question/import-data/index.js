var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.items = {
    main: 'main',
    file: ''
};

exports.title = '导入';

exports.large = true;

exports.store = {
    models: {
        state: {},
        file: { url: '../human/file/upload-file' },
        importData: { url: '../exam/question/import' },
        importDepotData: { url: '../exam/question-depot/import' },
        exportQuestionTemplate: { url: '../exam/question/export' },
        exportDepotTemplate: { url: '../exam/question-depot/export' },
        importResult: {},
        download: { url: '../human/file/download' }
    },
    callbacks: {
        init: function(payload) {
            this.models.importResult.clear();
            D.assign(this.models.state.data, {
                templateType: payload.templateType,
                isOtherModuleType: payload.isOtherModuleType,
                organizationId: payload.organizationId
            });
        },
        importData: function(payload) {
            var me = this,
                importResult = this.models.importResult,
                state = this.models.state.data,
                model = state.templateType === 1
                    ? this.models.importData : this.models.importDepotData;

            model.set(D.assign(payload, {
                isOtherModuleType: state.isOtherModuleType,
                organizationId: state.organizationId
            }));

            return this.post(model).then(function() {
                var result = model.data,
                    callback = me.module.renderOptions.callback;

                if (callback) callback(JSON.parse(result.data));

                importResult.set(D.assign(result, {
                    errorList: JSON.parse(result.errorList)
                }));
                importResult.data.importFinished = true;

                if (result.errorCount > 0) {
                    importResult.data.showErrorUrl = true;
                    me.app.message.error('导入存在错误数据，请点击下载错误数据链接查看');
                } else {
                    me.app.message.success('导入成功');
                }
                importResult.changed();
            });
        },
        displayErrorUrl: function() {
            this.models.importData.data.showErrorUrl = false;
            this.models.importData.changed();
        },
        clearModels: function() {
            _.forEach(this.models, function(m) {
                m.clear();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
