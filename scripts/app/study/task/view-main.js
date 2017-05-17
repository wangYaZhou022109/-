exports.bindings = {
    task: true,
    state: true
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
    state: function(data) {
        var state = data.state;
        state.flag = state.flag ? state.flag : 'desc';
        return state;
    }
};
