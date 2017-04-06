
exports.title = '导入课程';

exports.bindings = {
    downExcel: true
};

exports.events = {
    'click downloadExcel-*': 'downExcel',
    'click uploadExcel': 'uploadExcel'
};
exports.handlers = {
    downExcel: function(type) {
        var formObj = this.$('importCourse'),
            token = this.app.global.OAuth.token.access_token;
        formObj.action = this.bindings.downExcel.getFullUrl();
        this.$('importType').value = type;
        this.$('access_token').value = token;
        formObj.submit();
    },
    uploadExcel: function() {
        var view = this.module.items['import-upload'];
        this.app.viewport.modal(view);
    }
};
