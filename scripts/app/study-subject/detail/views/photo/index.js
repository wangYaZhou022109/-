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
            this.models.region.set(options.region);
            this.models.subject.set(options.subject);
            if (options.subject.id) {
                this.models.photos.params.subjectId = options.subject.id;
                return this.get(this.models.photos);
            }
            return this.models.photos;
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
