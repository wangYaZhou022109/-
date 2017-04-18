exports.bindings = {
    region: false,
    download: false,
    photos: true,
    state: true
};

exports.dataForTemplate = {
    photos: function(data) {
        var me = this,
            photos = data.photos,
            index = me.bindings.state.data.index,
            pagePhotos = [],
            i = 0,
            photo;
        if (photos) {
            for (; i < 6; i++) {
                photo = photos[i + index];
                if (photo) {
                    photo.imageUrl = me.bindings.download.getFullUrl() + '?id=' + photo.thumbnailId;
                    pagePhotos.push(photo);
                }
            }
        }
        return pagePhotos;
    }
};

exports.events = {
    'click turnPage-*': 'turnPage',
    'click showSwipe-*': 'showSwipe'
};

exports.handlers = {
    turnPage: function(data) {
        this.module.dispatch('turnPage', data);
    },
    showSwipe: function(id) {
        var regions = this.module.regions;
        this.bindings.state.data.currentId = id;
        regions.swipe.show(this.module.items.swipe);
    }
};
