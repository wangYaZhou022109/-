var _ = require('lodash/collection');
exports.items = {
    layout: 'layout'
};
exports.store = {
    models: {
        contents: {
            url: '../system/home-content'
        },
        down: {
            url: '../human/file/download'
        },
        dataType: {
            data: {
                trainClass: 1,
                gensee: 2,
                exam: 3,
                research: 4,
                mooc: 5,
                course: 9,
                subject: 10
            }
        },
        trainClass: {
            data: []
        },
        gensee: {
            url: '../course-study/gensee/front/find-by-ids'
        },
        exam: {
            url: '../exam/exam/front/find-by-ids'
        },
        research: {
            url: '../exam/research-activity/front/find-by-ids'
        },
        mooc: {
            data: []
        },
        course: {
            url: '../course-study/course-info/front/find-by-ids'
        },
        subject: {
            url: '../course-study/course-info/front/find-by-ids'
        }
    },
    callbacks: {
        init: function(payload) {
            var contents = this.models.contents,
                dataType = this.models.dataType.data,
                me = this;
            contents.clear();
            contents.params.moduleHomeConfigId = payload.moduleConfigId;
            contents.params.size = 50;
            contents.params.clientType = 1;
            contents.clear();
            return this.chain(
                function() {
                    return me.get(contents).then(function(data) {
                        return data && data[0];
                    });
                },
                // 课程
                function(result) {
                    var courseIds = [];
                    if (result.length > 0) {
                        courseIds = _.map(_.filter(result, ['dataType', dataType.course]), 'dataId') || [];
                        if (courseIds.length > 0) {
                            me.models.course.clear();
                            me.models.course.params.ids = courseIds.join(',');
                            return me.get(me.models.course).then(function() {
                                return result;
                            });
                        }
                    }
                    return result;
                },
                // 专题
                function(result) {
                    var subjectIds = [];
                    if (result.length > 0) {
                        subjectIds = _.map(_.filter(result, ['dataType', dataType.subject]), 'dataId') || [];
                        if (subjectIds.length > 0) {
                            me.models.subject.clear();
                            me.models.subject.params.ids = subjectIds.join(',');
                            return me.get(me.models.subject).then(function() {
                                return result;
                            });
                        }
                    }
                    return result;
                },
                // 直播
                function(result) {
                    var genseeIds = [];
                    if (result.length > 0) {
                        genseeIds = _.map(_.filter(result, ['dataType', dataType.gensee]), 'dataId') || [];
                        if (genseeIds.length > 0) {
                            me.models.gensee.clear();
                            me.models.gensee.params.ids = genseeIds.join(',');
                            return me.get(me.models.gensee).then(function() {
                                return result;
                            });
                        }
                    }
                    return result;
                },
                // 考试
                function(result) {
                    var examIds = [];
                    if (result.length > 0) {
                        examIds = _.map(_.filter(result, ['dataType', dataType.exam]), 'dataId') || [];
                        if (examIds.length > 0) {
                            me.models.exam.clear();
                            me.models.exam.params.ids = examIds.join(',');
                            return me.get(me.models.exam).then(function() {
                                return result;
                            });
                        }
                    }
                    return result;
                },
                // 调研
                function(result) {
                    var researchIds = [];
                    if (result.length > 0) {
                        researchIds = _.map(_.filter(result, ['dataType', dataType.research]), 'dataId') || [];
                        if (researchIds.length > 0) {
                            me.models.research.clear();
                            me.models.research.params.ids = researchIds.join(',');
                            return me.get(me.models.research).then(function() {
                                return result;
                            });
                        }
                    }
                    return result;
                }
            );
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
