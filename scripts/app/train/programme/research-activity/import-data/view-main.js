exports.bindings = {
    exportQuestionTemplate: true,
    importData: true,
    state: false
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
    downloadTemplateUrl: function() {
        var model = this.bindings.exportQuestionTemplate,
            state = this.bindings.state.data,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        url += ('exportType=1&type=' + state.type + '&access_token=' + token);
        return url;
    },
    errorDataUrl: function() {
        var model = this.bindings.exportQuestionTemplate,
            url = model.getFullUrl() + '?',
            state = this.bindings.state.data,
            token = this.app.global.OAuth.token.access_token;
        url += ('exportType=3&type=' + state.type + '&access_token=' + token);
        return url;
    }
};
