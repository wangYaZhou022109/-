exports.title = function() {
    return this.renderOptions.name;
};

exports.bindings = {
    preview: false,
};

exports.components = [
    function() {
        var attachmentId = this.renderOptions.attachmentId;
        var url = this.bindings.preview.getFullUrl() + '/' + attachmentId;
        if (!attachmentId) return false;
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'pdf',
                pdfUrl: url
            }
        };
    }
];
