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
    'online-resources': 'online-resources',
    swipe: '',
    main: 'main',
    bus: '',
    'two-brings': '',
    questionnaire: '',
    'train/class-detail/commit-task': { isModule: true },
    banner: 'banner',
    'train/class-detail/courseware': { isModule: true },
    'research-tips': '',
    'train/class-detail/online-attach': { isModule: true },
    'ranking-list': 'ranking-list'
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
        twoBrings: {
            url: '../train/class-two-brings',
        },
        twoBringsResult: {
            url: '../train/class-two-brings/result',
        },
        signUpInfo: {
            url: '../train/sign-up',
        },
        questionnaire: {
            url: '../train/questionnaire-survey/class-evaluate'
        },
        classInfo: {
            url: '../train/class-info/get'
        },
        groups: {
            url: '../train/class-group/get'
        },
        checkMember: {
            url: '../train/trainee/current-trainee'
        },
        classDetail: {
            url: '../train/class-detail/find'
        },
        staff: {
            url: '../train/classstaff/classstaffs'
        },
        offlineThemeList: {
            url: '../train/theme/findOfflineTheme'
        },
        offlineCourseList: {
            url: '../train/offline-course'
        },
        onlineCourseList: {
            url: '../train/online-course/front'
        },
        content: {
            data: []
        },
        bridge: {
            data: { init: 1 }
        },
        research: {
            url: '../train/questionnaire-survey/research-detail'
        },
        researchRecord: {
            url: '../train/questionnaire-survey/get-by-research'
        },
        trainee: {
            url: '../train/trainee/current-trainee'
        },
        courseStudyProgresss: {
            url: '../train/study-details/study'
        },
        members: {
            url: '../train/study-details/member'
        },
        course: {
            url: '../course-study/course-study-progress/total-study-time'
        },
        down: { url: '../human/file/download' },
    },

    callbacks: {
        init: function(options) {
            var photos = this.models.photos,
                download = this.models.download,
                classId = options.classId,
                classInfo = this.models.classInfo,
                groups = this.models.groups,
                checkMember = this.models.checkMember,
                classDetail = this.models.classDetail,
                staff = this.models.staff,
                offlineThemeList = this.models.offlineThemeList,
                offlineCourseList = this.models.offlineCourseList,
                onlineCourseList = this.models.onlineCourseList,
                courseStudyProgresss = this.models.courseStudyProgresss,
                members = this.models.members,
                course = this.models.course,
                me = this;
            this.models.classId.data.classId = classId;
            photos.params = { classId: classId };
            courseStudyProgresss.params = { classId: classId };
            members.params = { classId: classId };
            me.get(courseStudyProgresss);
            me.get(members).then(function(data) {
                course.params = data[0];
                me.get(course);
            });
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
            offlineThemeList.params.classId = classId;
            this.get(offlineThemeList);
            offlineCourseList.params.classId = classId;
            this.get(offlineCourseList);
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
            staff.params.classId = classId;
            this.get(staff);
            onlineCourseList.params.classId = classId;
            this.get(onlineCourseList);
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
        },
        twoBring: function() {
            var twoBringsResult = this.models.twoBringsResult,
                classId = this.models.classId.data.classId,
                signUpInfo = this.models.signUpInfo,
                me = this;
            twoBringsResult.clear();
            twoBringsResult.params = { classId: classId };
            signUpInfo.clear();
            signUpInfo.params = { classId: classId };
            return me.get(twoBringsResult).then(function() {
                me.get(signUpInfo);
            });
        },
        commitTwoBrings: function(payload) {
            var twoBrings = this.models.twoBrings,
                me = this;
            twoBrings.set(payload);
            return me.save(twoBrings);
        },
        questionnaire: function() {
            var questionnaire = this.models.questionnaire,
                classId = this.models.classId.data.classId;
            questionnaire.params = { classId: classId };
            return this.get(questionnaire);
        },
        getRecordByResearch: function() {
            var research = this.models.research,
                classId = this.models.classId.data.classId,
                me = this;
            research.params = { classId: classId };
            this.models.research.clear();
            this.models.researchRecord.clear();
            this.get(research).then(function(data) {
                D.assign(me.models.researchRecord.params, { researchId: data[0].id });
                return me.get(me.models.researchRecord);
            });
        },
        getTrainee: function(payload) {
            var trainee = this.models.trainee;
            trainee.clear();
            trainee.params = { type: 0, classId: payload.classId };
            this.get(trainee);
        }
    }
};

exports.beforeRender = function() {
    this.chain([this.dispatch('init', this.renderOptions), this.dispatch('getTrainee', this.renderOptions)]);
};
