exports.title = '批量导入学员';

exports.bindings = {
    dowloadExcel: true,
    uploadExcel: 'changeFile',
    state: true
};

exports.small = true;

exports.events = {
    'click download-Excel-*': 'dowloadExcel'
};

exports.handlers = {
    dowloadExcel: function(type) {
        var formObj = this.$('import-form'),
            token = this.app.global.OAuth.token.access_token;
        formObj.action = this.bindings.dowloadExcel.getFullUrl();
        this.$('importType').value = type;
        this.$('access_token').value = token;
        formObj.submit();
    }
};

exports.components = function() {
    return [{
        id: 'uploadExcel',
        name: 'uploader',
        options: {
            model: 'uploadExcel',
            chunk_size: '10mb',
            signle_file: true,
            filters: {
                max_file_size: '10mb',
                mime_types: [{
                    title: 'files',
                    extensions: 'xls,xlsx'
                }]
            }
        }
    }];
};
exports.changeFile = function() {
    var result = this.bindings.uploadExcel.data.imgs;
    var classId = this.bindings.state.data;
    if (result.failCount === 0) {
        this.module.dispatch('init', classId);
        this.app.viewport.closeModal();
    } else {
        this.render();
    }
};
exports.dataForTemplate = {
    errors: function(data) {
        if (data.uploadExcel.imgs) {
            return data.uploadExcel.imgs.failCount > 0;
        }
        return false;
    }
};
