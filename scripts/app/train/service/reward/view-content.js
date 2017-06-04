exports.bindings = {
    courseSalary: true,
    // downloadinside: false,
    downloadexternal: false
};
exports.actions = {
    'click edit*': 'edit'
};
exports.handlers = {
    inside: function() {
        this.app.viewport.modal(this.module.items.redio);
    },
};
exports.dataForActions = {
    edit: function(id) {
        return id;
    },
};
exports.events = {
    'click inside*': 'inside',
};
exports.dataForTemplate = {
    inside: function() {
        // var url = this.bindings.downloadexternal.getFullUrl();
        // var token = this.app.global.OAuth.token.access_token;
        // url += ('?id=' + this.module.renderOptions.state.classId + '&access_token=' + token);
        // return url;
    },
    // external: function() {
    //     var url = this.bindings.downloadexternal.getFullUrl();
    //     var params = this.bindings.courseSalary.params;
    //     // var token = this.app.global.OAuth.token.access_token;
    //     _.map(params, function(v, k) {
    //         url += (k + '=' + v + '&');
    //     });
    //     // url += ('access_token=' + token);
    //     return url;
    // },
};
exports.actionCallbacks = {
    edit: function() {
        this.app.viewport.modal(this.module.items.edit);
    }
};

