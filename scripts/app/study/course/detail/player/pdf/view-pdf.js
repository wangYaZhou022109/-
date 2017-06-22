var timeInterval, timeInterval2, logId;
var $ = require('jquery');
exports.components = [
    function() {
        var state = this.bindings.state.data,
            section = state.section || {},
            localLocation = state.localLocation,
            progress = state.progress || {},
            pageNum = progress.lessonLocation || 1,
            url = this.bindings.preview.getFullUrl() + '/' + section.resourceId;
        if (localLocation) pageNum = localLocation;
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

exports.bindings = {
    state: false,
    preview: false,
    startProgress: 'startProgress'
};

exports.beforeClose = function() {
    clearInterval(timeInterval);
    clearTimeout(timeInterval2);
    $(window).off('blur');
    $(window).off('focus');
    $(window).off('beforeunload');
    this.commitProgress();
};

exports.afterRender = function() {
    var me = this;
    timeInterval = setInterval(function() {
        me.commitProgress();
    }, 1000 * 60);

    $(window).on('beforeunload', function() {
        clearInterval(timeInterval);
        clearTimeout(timeInterval2);
        me.commitProgress(false);
    });
    $(window).on('blur', function() {
        me.commitProgress(false);
    });
    $(window).on('focus', function() {
        me.module.dispatch('startProgress');
    });

    timeInterval2 = setTimeout(function() {
        me.commitProgress();
    }, 1000 * 10); // 10秒后完成 10秒提交一次
    // 加载完毕之后 开始进度
    return this.module.dispatch('startProgress');
};

exports.mixin = {
    commitProgress: function(flag) {
        var pdfData, lessonLocation,
            me = this;
        if (!this.components.viewPdf) return false;
        if (!logId) return false;

        pdfData = this.components.viewPdf.getData();
        lessonLocation = pdfData ? pdfData.pageNum : 0;

        return this.module.dispatch('updateProgress', {
            logId: logId, lessonLocation: lessonLocation
        }).then(function() {
            logId = null;
            if (flag !== false) me.module.dispatch('startProgress');
        });
    }
};
exports.startProgress = function() {
    logId = this.bindings.startProgress.data.id;
};
