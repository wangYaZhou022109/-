exports.bindings = {
    section: true,
    sectionProgress: true,
    download: false,
    time: false
};

exports.components = [
    function() {
        var section = this.bindings.section.data || {},
            progress = this.bindings.sectionProgress.data || {},
            pageNum = progress.lessonLocation || 1,
            url = this.bindings.download.getFullUrl() + '/' + section.resourceId;
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

exports.beforeClose = function() {
    var me = this,
        beginTime = me.bindings.time.data,
        pdfData = me.components.viewPdf.getData(),
        studyTime = 0,
        lessonLocation = pdfData.pageNum;
    // return me.module.dispatch('time').then(function(data) {
    //     var endTime = data[0];
    //     studyTime = (endTime - beginTime) / 1000;
    this.module.dispatch('updatePregress', {
        beginTime: beginTime,
        studyTime: Math.ceil(studyTime),
        lessonLocation: lessonLocation
    });
    // });
};
