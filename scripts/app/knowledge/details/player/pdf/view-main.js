exports.bindings = {
    knowledge: true,
    download: false
};

exports.components = [
    function() {
        var knowledge = this.bindings.knowledge.data,
            url = this.bindings.download.getFullUrl() + '/' + knowledge.resourceId;
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'player-pdf',
                pdfUrl: url
            }
        };
    }
];
