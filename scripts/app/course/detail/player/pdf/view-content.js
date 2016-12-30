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
            url = this.bindings.download.getFullUrl() + '?id=' + section.resourceId;
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'pdf',
                pdfUrl: url,
                pageNum: pageNum
            }
        };
    }
];

exports.beforeClose = function() {
    var me = this,
        beginTime = me.bindings.time.data,
        endTime = 0,
        pdfData = me.components.viewPdf.getData(),
        startTime = me.bindings.time.data,
        studyTotalTime = 0,
        completedRate = 0,
        lessonLocation = pdfData.pageNum;
    return me.module.dispatch('time').then(function(data) {
        endTime = data[0];
        studyTotalTime = (data[0] - startTime) / 1000;
        completedRate = 100;
        me.module.dispatch('updatePregress', {
            beginTime: beginTime,
            endTime: endTime,
            studyTotalTime: Math.ceil(studyTotalTime),
            completedRate: completedRate,
            lessonLocation: lessonLocation
        });
    });
};

