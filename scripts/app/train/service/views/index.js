var D = require('drizzlejs'),
    _ = require('lodash/collection');
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
    main: 'main',
    bus: ''
};

exports.store = {
    models: {
        photos: {
            url: '../train/album/photo'
        },
        download: {
            url: '../human/file/download'
        },
        bus: {
            url: '../train/bus/member-by-bus'
        },
        state: {
            data: {
                index: 0
            }
        },
        detailInsert: {
            url: '../train/bus-detail'
        },
        detaildelete: {
            url: '../train/bus-detail'
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
        shuttleBusInformation: function() {
            var bus = this.models.bus,
                classId = this.models.classId.data.classId;
            bus.set({ id: classId });
            return this.get(bus).then(function(data) {
                _.map(data[0] || [], function(cinfo, i) {
                    var e = cinfo;
                    e.flag = true;
                    if (i === 0) {
                        e.show = true;
                    } else {
                        e.show = false;
                    }
                    if (cinfo.busDetails.length == null) {
                        e.flag = false;
                    }
                    return e;
                });
                return data;
            });
        },
        sectionDisplay: function(id) {
            var bus = this.models.bus;
            _.map(bus.data || [], function(buss) {
                var busObj = buss;
                if (busObj.id === id) {
                    busObj.show = !busObj.show;
                }
                return busObj;
            });
            bus.changed();
        },
        detailInsert: function(params) {
            var detail = this.models.detailInsert;
            detail.set({ id: params });
            return this.post(detail);
        },
        detaildelete: function(params) {
            var detail = this.models.detaildelete;
            detail.set({ id: params });
            return this.del(detail);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.state);
};
