var timeInterval, logId;

exports.bindings = {
    state: false,
    download: false,
    attachment: false,
    startProgress: 'startProgress'
};
exports.components = [function() {
    var state = this.bindings.state.data;
    var localLocation = state.localLocation;
    var currentTime = 0;
    if (state.progress) {
        currentTime = state.progress.lessonLocation;
    }
    if (localLocation) {
        currentTime = Math.floor(localLocation);
    }
    return {
        id: 'player',
        name: 'videojs',
        options: {
            currentTime: currentTime,
            video: {
                height: 500, // 自动缩放 aspectRatio
                // aspectRatio: true,
                autoplay: true
            },
        }
    };
}];

exports.dataForTemplate = {
    url: function(data) {
        var path = data.attachment.path;
        return '/' + path + '?type=mp4';
    }
};

exports.beforeClose = function() {
    clearInterval(timeInterval);
    this.commitProgress();
};

exports.afterRender = function() {
    var me = this;
    timeInterval = setInterval(function() {
        var flag = me.commitProgress();
        if (flag) me.module.dispatch('startProgress');
    }, 1000 * 60);

    window.onunload = function() {
        me.commitProgress();
    };
    return this.module.dispatch('startProgress');
};
exports.video = {
    ended: function() {
        var flag = this.commitProgress();
        if (flag) this.module.dispatch('startProgress');
    }
};

exports.mixin = {
    commitProgress: function() {
        var player = this.components.player;
        var time = player.getLearnTime();
        var process = {
            logId: logId,
            lessonLocation: Math.floor(player.currentTime()),
            studyTime: player.getLearnTime(),
            resourceTotalTime: Math.floor(player.duration()),
        };
        if (time < 1) return false;
        return this.chain([
            this.module.dispatch('updateProgress', process),
            function() { player.resetLearnTime(); }
        ]);
    }
};

exports.startProgress = function() {
    logId = this.bindings.startProgress.data.id;
};
