var _ = require('lodash/collection');
exports.bindings = {
    photos: false,
    download: false,
    state: false
};

exports.components = [function() {
    var photos = this.bindings.photos.data,
        state = this.bindings.state.data,
        index = 0;
    _.map(photos, function(opt, i) {
        var photo = opt;
        if (photo.attachmentId === state.currentId) {
            index = i;
        }
        return photo;
    });
    return {
        id: 'photoSwipe',
        name: 'picker',
        options: {
            picker: 'photoswipe',
            photos: photos,
            index: index
        }
    };
}];
