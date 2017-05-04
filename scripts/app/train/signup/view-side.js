exports.bindings = {
    state: true,
    downloadDoc: false
};

exports.dataForTemplate = {
    docUrl: function() {
        var model = this.bindings.downloadDoc,
            state = this.bindings.state.data,
            url = model.getFullUrl() + '?',
            token = this.app.global.OAuth.token.access_token;
        url += ('classId=' + state.classId);
        url += ('&access_token=' + token);
        return url;
    }
};
