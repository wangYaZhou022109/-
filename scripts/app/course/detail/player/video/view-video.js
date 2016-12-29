exports.bindings = {
    section: true,
    sectionProgress: true
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
    var learnTime = this.components.player.getLearnTime(),
        totalTime = this.components.player.duration();
    this.module.dispatch('updateLearnTime', { learnTime: learnTime, totalTime: totalTime });
};
