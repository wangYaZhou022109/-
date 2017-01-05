exports.bindings = {
    task: true,
    state: true
};

exports.components = [
    function() {
        var state = this.bindings.state.data || {};
        if (state.flag === 'doc') {
            return {
                id: 'viewPdf',
                name: 'picker',
                options: {
                    picker: 'pdf',
                    pdfUrl: state.docUrl
                }
            };
        }
        return false;
    }
];
