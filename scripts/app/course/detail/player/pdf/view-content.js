exports.bindings = {
    section: true,
    sectionProgress: true,
    download: false
};

exports.components = [
    function() {
        var section = this.bindings.section.data || {},
            progress = this.bindings.sectionProgress.data || {},
            pageNum,
            pdfUrl;
        if (progress.lessonLocation) {
            pageNum = progress.lessonLocation;
        }
        section.attachmentId = '8870f1ed-1cf7-4f0b-b3b7-9d3c64c493e7';
        pdfUrl = this.bindings.download.getFullUrl() + '?id=' + section.attachmentId;
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'pdf',
                pdfUrl: pdfUrl,
                pageNum: pageNum
            }
        };
    }
];
