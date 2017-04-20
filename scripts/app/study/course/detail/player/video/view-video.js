var timeInterval;

exports.bindings = {
    state: false,
    download: false,
    time: false,
    attachment: false
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
    var player = this.components.player,
        state = this.bindings.state.data,
        sectionId = state.section.id,
        localTime = state.localTime || 0,
        beginTime = this.bindings.time.data,
        studyTime = player.getLearnTime() + localTime,
        totalTime = player.duration(),
        lessonLocation = player.currentTime(),
        callback = this.module.renderOptions.callback;
    clearInterval(timeInterval);
    this.module.dispatch('updateProgress', {
        beginTime: beginTime,
        studyTime: Math.floor(studyTime),
        resourceTotalTime: Math.floor(totalTime),
        lessonLocation: Math.floor(lessonLocation),
        clientType: 0,
        sectionId: sectionId
    }).then(function(data) { callback(data); });
};

exports.afterRender = function() {
    // 每分钟保存进度, lessonLocation,studyTime,sectionId
    var player = this.components.player,
        sectionId = this.bindings.state.data.section.id,
        me = this;
    var process = function() {
        return {
            lessonLocation: player.currentTime(),
            studyTime: player.getLearnTime(),
            sectionId: sectionId
        };
    };
    timeInterval = setInterval(function() {
        me.module.dispatch('storeProcess', process());
    }, 1000 * 10);
};
