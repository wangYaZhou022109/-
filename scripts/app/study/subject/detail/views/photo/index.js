var _ = require('lodash/collection');
exports.items = {
    pannel: 'pannel',
    swipe: ''
};

exports.store = {
    models: {
        region: {},
        subject: {},
        download: {
            url: '../human/file/download'
        },
        photos: {
            url: '../course-study/course-info/photo'
        },
        state: {
            data: {
                index: 0
            }
        }
    },
    callbacks: {
        init: function(options) {
            var photos = options.subject.photos,
                download = this.models.download;
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            _.map(photos, function(obj) {
                var photo = obj;
                var img = new Image();
                photo.imageUrl = download.getFullUrl() + '?id=' + photo.attachmentId;
                img.src = photo.imageUrl;
                photo.image = img;
                return photo;
            });
            this.models.photos.set(options.subject.photos);
        },
        turnPage: function(data) {
            var state = this.models.state.data,
                photos = this.models.photos.data || [],
                index = state.index;
            if (data === 'prev' && index > 0) {
                index--;
            } else if (data === 'next' && index < (photos.length - 6)) {
                index++;
            }
            this.models.state.set({
                index: index
            });
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
