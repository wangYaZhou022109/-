var _ = require('lodash/collection');
exports.bindings = {
    photos: false,
    download: false,
    state: false
};

exports.components = [function() {
    var photos = this.bindings.photos.data,
        state = this.bindings.state.data,
        me = this,
        index = 0;
    _.map(photos, function(opt, i) {
        var photo = opt;
        photo.imageUrl = me.bindings.download.getFullUrl() + '?id=' + photo.attachmentId;
        if (photo.attachmentId === state.currentId) {
            index = i;
        }
        return photo;
    });
    debugger;
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
