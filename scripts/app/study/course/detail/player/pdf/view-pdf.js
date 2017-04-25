var timeInterval, logId;
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

exports.bindings = {
    state: false,
    download: false,
    startProgress: 'startProgress'
};

exports.beforeClose = function() {
    clearInterval(timeInterval);
    this.commitProgress();
};

exports.afterRender = function() {
    var me = this;
    timeInterval = setInterval(function() {
        me.commitProgress();
    }, 1000 * 60);

    window.onunload = function() {
        me.commitProgress(false);
    };

    setTimeout(function() {
        me.commitProgress(false);
    }, 1000 * 10); // 10秒后完成 10秒提交一次
    // 加载完毕之后 开始进度
    return this.module.dispatch('startProgress');
};

exports.mixin = {
    commitProgress: function(flag) {
        var pdfData, lessonLocation,
            me = this;
        if (!this.components.viewPdf) return false;

        pdfData = this.components.viewPdf.getData();
        lessonLocation = pdfData ? pdfData.pageNum : 0;

        return this.module.dispatch('updateProgress', {
            logId: logId, lessonLocation: lessonLocation
        }).then(function() {
            if (flag !== false) me.module.dispatch('startProgress');
        });
    }
};
exports.startProgress = function() {
    logId = this.bindings.startProgress.data.id;
};
