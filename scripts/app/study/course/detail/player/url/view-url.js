var timeInterval, logId;

exports.bindings = {
    state: false,
    download: false,
    startProgress: 'startProgress'
};

exports.dataForTemplate = {
    url: function(data) {
        var url = data.state.section.url;
        if (!url.startsWith('http')) {
            url = '//' + url;
        }
        return url;
    }
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
        var me = this;
        return this.module.dispatch('updateProgress', { logId: logId }).then(function() {
            if (flag !== false) me.module.dispatch('startProgress');
        });
    }
};
exports.startProgress = function() {
    logId = this.bindings.startProgress.data.id;
};
