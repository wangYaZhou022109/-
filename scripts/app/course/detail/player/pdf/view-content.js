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
        pdfUrl = this.bindings.download.getFullUrl() + '?id=' + section.resourceId;
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
