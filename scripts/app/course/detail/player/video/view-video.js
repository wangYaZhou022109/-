
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
            height: 400
        },
        currentTime: 30
    }
}];
