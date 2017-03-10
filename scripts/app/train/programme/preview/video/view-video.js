exports.bindings = {
    state: false,
    download: false
};


exports.components = [function() {
    var currentTime = 0;
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
    section: function() {
        var section = {},
            id = this.bindings.state.data.id;
        section.url = this.bindings.download.getFullUrl() + '?id=' + id;
        return section;
    }
};
