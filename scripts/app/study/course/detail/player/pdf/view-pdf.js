var timeInterval;
exports.bindings = {
    state: false,
    download: false,
    time: false
};

exports.components = [
    function() {
        var state = this.bindings.state.data,
            section = state.section || {},
            localLocation = state.localLocation,
            progress = state.progress || {},
            pageNum = progress.lessonLocation || 1,
            url = this.bindings.download.getFullUrl() + '/' + section.resourceId;
        if (localLocation) pageNum = localLocation;
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
        lessonLocation;
    lessonLocation = pdfData ? pdfData.pageNum : 0;
    clearInterval(timeInterval);
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
exports.afterRender = function() {
    // 每分钟保存进度, lessonLocation,studyTime,sectionId
    var pdfData = this.components.viewPdf.getData(),
        sectionId = this.bindings.state.data.section.id,
        me = this;
    var lessonLocation = pdfData ? pdfData.pageNum : 0;
    var process = function() {
        return {
            lessonLocation: lessonLocation,
            sectionId: sectionId
        };
    };
    timeInterval = setInterval(function() {
        me.module.dispatch('storeProcess', process());
    }, 1000 * 10);
};
