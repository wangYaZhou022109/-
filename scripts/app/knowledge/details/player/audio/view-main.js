exports.bindings = {
    knowledge: true,
    attachment: false
};

exports.components = [function() {
    return {
        id: 'player',
        name: 'videojs',
        options: {
            video: {
                autoplay: true
            }
        }
    };
}];

exports.dataForTemplate = {
    url: function(data) {
        var path = data.attachment.path;
        return '/' + path + '?type=mp4';
    }
};

