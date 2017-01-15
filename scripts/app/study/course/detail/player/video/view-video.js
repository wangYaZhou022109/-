exports.bindings = {
    state: false,
    download: false,
    time: false
};


exports.components = [function() {
    var section = this.bindings.state.data.section;
    var currentTime = 0;
    if (section && section.progress) {
        currentTime = section.progress.lessonLocation;
    }
    return {
        id: 'player',
        name: 'videojs',
        options: {
            currentTime: currentTime,
            video: {
                fluid: true, // 自动缩放 aspectRatio
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
        sectionId = this.bindings.state.data.section.id,
        beginTime = this.bindings.time.data,
        studyTime = player.getLearnTime(),
        totalTime = player.duration(),
        lessonLocation = player.currentTime(),
        callback = this.module.renderOptions.callback;

    this.module.dispatch('updateProgress', {
        beginTime: beginTime,
        studyTime: Math.ceil(studyTime),
        resourceTotalTime: Math.ceil(totalTime),
        lessonLocation: Math.ceil(lessonLocation),
        clientType: 0,
        sectionId: sectionId
    }).then(function(data) { callback(data); });
};
