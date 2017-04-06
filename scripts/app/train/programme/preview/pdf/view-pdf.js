exports.bindings = {
    state: false,
    download: false
};

exports.components = [
    function() {
        var id = this.bindings.state.data.id,
            pageNum = 1,
            url = this.bindings.download.getFullUrl() + '/' + id;
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'player-pdf',
                pdfUrl: url,
                pageNum: Number(pageNum)
            }
        };
    }
];
