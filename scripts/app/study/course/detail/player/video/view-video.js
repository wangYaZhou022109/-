exports.bindings = {
    section: true,
    sectionProgress: true,
    time: false
};


exports.components = [{
    id: 'player',
    name: 'videojs',
    options: {
        video: {
            fluid: true,    // 自动缩放
            // aspectRatio: '840:505' // 自定义比例缩放
        },
        currentTime: 50
    }
}];

exports.dataForTemplate = {
    section: function(data) {
        var section = data.section;
        section.url = section.url + '?id=' + section.resourceId;

        return section;
    }
};

exports.beforeClose = function() {
    var me = this,
        beginTime = me.bindings.time.data,
        endTime = 0,
        studyTime = this.components.player.getLearnTime() + 0.1,
        totalTime = this.components.player.duration() + 0.1,
        progressRate = (studyTime / totalTime) * 100,
        lessonLocation = this.components.player.currentTime();
    return me.module.dispatch('time').then(function(data) {
        endTime = data[0];
        me.module.dispatch('updateProgress', {
            beginTime: beginTime,
            endTime: endTime,
            studyTime: Math.ceil(studyTime),
            resourceTotalTime: Math.ceil(totalTime),
            progressRate: Math.ceil(progressRate),
            lessonLocation: lessonLocation
        });
    });
};
