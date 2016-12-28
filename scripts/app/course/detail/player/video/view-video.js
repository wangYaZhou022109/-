
exports.beforeClose = function() {
    var learnTime = this.components.player.getLearnTime(),
        totalTime = this.components.player.duration();
    // console.log({ learnTime: learnTime, totalTime: totalTime });
    this.module.dispatch('updateLearnTime', { learnTime: learnTime, totalTime: totalTime });
};

exports.components = [{
    id: 'player',
    name: 'videojs',
    options: {
        video: {
            fluid: true,    // 自动缩放
            // aspectRatio: '840:505' // 自定义比例缩放
        },
        currentTime: 30
    }
}];
