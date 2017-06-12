var errors = require('./app/util/errors'),
    _ = require('lodash/collection');

exports.bindings = {
    exportQuestionTemplate: false,
    exportDepotTemplate: false,
    importResult: true,
    state: false,
    download: false
};

exports.events = {
    'click import': 'importData',
    'click downloadError': 'downloadError'
};

exports.handlers = {
    importData: function() {
        this.app.viewport.modal(this.module.items.file);
    },
    downloadError: function() {
        var me = this;
        return this.module.dispatch('displayErrorUrl').then(function() {
            me.app.viewport.closePopup();
        });
    }
};

exports.dataForTemplate = {
    downloadTemplateUrl: function(data) {
        var model = data.state.templateType === 1
                ? this.bindings.exportQuestionTemplate : this.bindings.exportDepotTemplate,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        if (data.state.isOtherModuleType) {
            url += 'isOtherModuleType=' + data.state.isOtherModuleType + '&';
        }
        if (data.state.organizationId) {
            url += 'organizationId=' + data.state.organizationId + '&';
        }
        url += ('exportType=1&access_token=' + token);
        return url;
    },
    errorDataUrl: function(data) {
        var model = this.bindings.download;
        return model.getFullUrl() + '?id=' + data.importResult.errorFileId;
    },
    // importResult: function(data) {
    //     return D.assign(data.importResult, {
    //         errorList: _.map(data.importResult.errorList, function(e, i) {
    //             return D.assign(e, {
    //                 n: i + 1,
    //                 errors: _.map(e.errors, function(ee) {
    //                     return D.assign(ee, {
    //                         code: errors.get(ee.code)
    //                     });
    //                 })
    //             });
    //         })
    //     });
    // },
    errorMsg: function(data) {
        if (data.importResult) {
            return _.map(data.importResult.errorList, function(error) {
                var msg = '不能为空';
                if (error.code) msg = errors.get(error.code);
                return '第' + error.row + '行, 第' + (error.column + 1) + '列有错误。[' + msg + ']';
            });
        }
        return '';
    }
};
