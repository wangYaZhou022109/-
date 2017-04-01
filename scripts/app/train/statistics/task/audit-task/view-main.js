exports.bindings = {
    all: true,
    download: false,
    state: true,
};

exports.events = {
    'click viewDesc': 'viewDesc'
};

exports.handlers = {
    viewDesc: function() {
        this.module.dispatch('preview', {
            flag: 'desc'
        });
    }
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

exports.dataForTemplate = {
    mainState: function(data) {
        var mainState = data.mainState;
        return mainState;
    }
};
