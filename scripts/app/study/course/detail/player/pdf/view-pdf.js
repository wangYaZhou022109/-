exports.bindings = {
    state: false,
    download: false,
    time: false
};

exports.components = [
    function() {
        var section = this.bindings.state.data.section || {},
            progress = section.sectionProgress || {},
            pageNum = progress.lessonLocation || 1,
            url = this.bindings.download.getFullUrl() + '/' + section.resourceId;
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'pdf',
                pdfUrl: url,
                pageNum: Number(pageNum)
            }
        };
    }
];

exports.beforeClose = function() {
    var me = this,
        beginTime = me.bindings.time.data,
        pdfData = me.components.viewPdf.getData(),
        studyTime = 0,
        lessonLocation;
    lessonLocation = pdfData ? pdfData.pageNum : 0;
    this.module.dispatch('updatePregress', {
        beginTime: beginTime,
        studyTime: Math.ceil(studyTime),
        lessonLocation: lessonLocation,
        clientType: 0,
        sectionId: this.bindings.state.data.section.id,
    }).then(function(data) {
        me.module.renderOptions.callback(data);
    });
};

