exports.bindings = {
    attachment: true,
    down: false
};


exports.components = [
    function() {
        var attachment = this.bindings.attachment.data || {},
            pdfUrl = this.bindings.down.getFullUrl() + '?id=' + attachment.attachmentId;
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'pdf',
                pdfUrl: pdfUrl,
                pageNum: 1
            }
        };
    }
];
