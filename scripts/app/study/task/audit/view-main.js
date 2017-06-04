var _ = require('lodash/collection');
exports.bindings = {
    task: true,
    state: true,
    sectionStudyProgress: true,
    preview: false
};

exports.components = [
    function() {
        var state = this.bindings.state.data || {};
        if (state.flag === 'pdf') {
            return {
                id: 'viewPdf',
                name: 'picker',
                options: {
                    picker: 'pdf',
                    pdfUrl: state.attachUrl
                }
            };
        }
        return false;
    }
];

exports.dataForTemplate = {
    sectionStudyProgress: function(data) {
        var sectionStudyProgress = data.sectionStudyProgress,
            me = this;
        _.map(sectionStudyProgress.sectionAttachments || [], function(attach) {
            var obj = attach;
            obj.downUrl = me.bindings.preview.getFullUrl() + '/' + obj.attachmentId;
            if (obj.contentType && obj.contentType === 1) {
                obj.preview = true;
            }
        });
        return sectionStudyProgress;
    }
};
