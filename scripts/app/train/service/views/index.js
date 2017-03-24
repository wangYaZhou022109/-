var D = require('drizzlejs');
exports.title = '班级详情页';
exports.items = {
    pannel: 'pannel',
    'class-information': 'class-information',
    'class-member': 'class-member',
    'class-notice': 'class-notice',
    'curriculum-schedule': 'curriculum-schedule',
    'discussion-area': 'discussion-area',
    'online-rresources': 'online-rresources',
    swipe: '',
    fmtrainees: '',
    main: 'main'
};

exports.store = {
    models: {
        photos: {
            url: '../train/album/photo'
        },
        download: {
            url: '../human/file/download'
        },
        state: {
            data: {
                index: 0
            }
        },
        classId: {
            data: {}
        },
        fmtrainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
    },

    callbacks: {
        init: function(options) {
            var photos = this.models.photos,
                classId = options.classId;
            this.models.classId.data.classId = classId;
            photos.params = { classId: classId };
            this.get(photos);
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
        },
        fmtrainees: function() {
            var fmtrainees = this.models.fmtrainees;
            D.assign(fmtrainees.params, {
                classId: this.models.classId.data.classId,
                auditStatus: 1
            });
            return this.get(fmtrainees);
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.state);
};
