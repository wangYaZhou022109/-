var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.title = '班级详情页';

exports.items = {
    banner: 'banner',
    classmate: 'classmate'
};

exports.store = {
    models: {
        photos: {
            url: '../train/album/photo'
        },
        download: {
            url: '../human/file/download'
        },
        classInfo: {
            url: '../train/class-info/get'
        },
        groups: {
            url: '../train/class-group/get'
        },
        classDetail: {
            url: '../train/class-detail/find'
        },
        classId: {
            data: {}
        },
        checkMember: {
            url: '../train/trainee/current-trainee'
        },
        list: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        menu: {
            url: '../train/trainee-group'
        },
        state: { data: {} }
    },

    callbacks: {
        list: function(params) {
            var list = this.models.list,
                state = this.models.state;
            state.data.groupId = params;
            D.assign(list.params, {
                classId: this.models.classId.data.classId,
                auditStatus: 1,
                groupId: params
            });
            return this.get(list);
        },
        init: function(options) {
            var download = this.models.download,
                menu = this.models.menu,
                photos = this.models.photos,
                classId = options.classId,
                classInfo = this.models.classInfo,
                groups = this.models.groups,
                classDetail = this.models.classDetail,
                checkMember = this.models.checkMember,
                me = this,
                state = this.models.state,
                see = options.see;
            this.models.classId.data.classId = classId;
            menu.params = { classId: options.classId };
            photos.params = { classId: classId };
            state.data.see = see;
            state.changed();
            this.get(photos).then(function(data) {
                _.map(data[0], function(obj) {
                    var photo = obj;
                    var img = new Image();
                    photo.imageUrl = download.getFullUrl() + '?id=' + photo.attachmentId;
                    img.src = photo.imageUrl;
                    photo.image = img;
                    return photo;
                });
            });
            classInfo.params.id = classId;
            this.get(classInfo).then(function(data) {
                var obj = data[0];
                if (obj.groupId) {
                    groups.params.id = obj.groupId;
                    me.get(groups);
                }
                checkMember.params = { type: 0, classId: classId };
                me.get(checkMember).then(function(member) {
                    var m = member[0];
                    if (m && m.auditStatus === 1) {
                        classInfo.data.isFormal = true;
                    }
                });
            });
            classDetail.params.id = classId;
            this.get(classDetail);
            return this.get(menu);
        }
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions).then(function(data) {
        var proupId = 0;
        if (data[0].length < 1) {
            me.dispatch('list', proupId);
        }
        if (data[0] != null || []) {
            proupId = data[0][0].id;
        }
        me.dispatch('list', proupId);
    });
};
