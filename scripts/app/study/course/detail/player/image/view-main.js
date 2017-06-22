var timeInterval, timeInterval2, logId;
var $ = require('jquery');
exports.bindings = {
    download: false,
    state: false,
    startProgress: 'startProgress'
};

exports.dataForTemplate = {
    url: function(data) {
        var section = data.state.section || {};
        return this.bindings.download.getFullUrl() + '?id=' + section.resourceId;
    }
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
        var me = this;
        if (!logId) return false;
        return this.module.dispatch('updateProgress', { logId: logId }).then(function() {
            logId = null;
            if (flag !== false) me.module.dispatch('startProgress');
        });
    }
};
exports.startProgress = function() {
    logId = this.bindings.startProgress.data.id;
};
