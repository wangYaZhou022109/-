var timeInterval;

exports.bindings = {
    state: false,
    download: false,
    time: false
};
exports.components = [function() {
    var state = this.bindings.state.data;
    var section = state.section;
    var localLocation = state.localLocation;
    var currentTime = 0;
    if (section && section.progress) {
        currentTime = section.progress.lessonLocation;
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
                fluid: true, // 自动缩放 aspectRatio
                autoplay: true
            },
        }
    };
}];

exports.dataForTemplate = {
    section: function(data) {
        var section = data.state.section;
        section.url = this.bindings.download.getFullUrl() + '?id=' + section.resourceId;
        return section;
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
