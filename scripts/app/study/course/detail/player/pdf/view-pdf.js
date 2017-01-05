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
        endTime = 0,
        pdfData = me.components.viewPdf.getData(),
        studyTime = 0,
        lessonLocation = pdfData.pageNum;
    return me.module.dispatch('time').then(function(data) {
        endTime = data[0];
        studyTime = (endTime - beginTime) / 1000;
        me.module.dispatch('updatePregress', {
            beginTime: beginTime,
            commitTime: endTime,
            studyTime: Math.ceil(studyTime),
            lessonLocation: lessonLocation
        });
    });
};

