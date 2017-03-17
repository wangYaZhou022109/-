exports.bindings = {
    knowledge: true,
    download: false
};

exports.components = [function() {
    return {
        id: 'player',
        name: 'videojs',
        video: {
            fluid: true,
            autoplay: true
        }
    };
}];
exports.dataForTemplate = {
    url: function(data) {
        return this.bindings.download.getFullUrl() + '?id=' + data.knowledge.resourceId;
    }
};

