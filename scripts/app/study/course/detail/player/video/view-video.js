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
        studyTotalTime = this.components.player.getLearnTime(),
        totalTime = this.components.player.duration(),
        completedRate = (studyTotalTime / totalTime) * 100,
        lessonLocation = this.components.player.currentTime();
    return me.module.dispatch('time').then(function(data) {
        endTime = data[0];
        me.module.dispatch('updateProgress', {
            beginTime: beginTime,
            endTime: endTime,
            studyTotalTime: Math.ceil(studyTotalTime),
            completedRate: Math.ceil(completedRate),
            lessonLocation: lessonLocation
        });
    });
};
