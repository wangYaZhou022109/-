var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    members: true,
    course: true,
    courseStudyProgresss: true
};

exports.dataForTemplate = {
    study: function() {
        var courseStudyProgresss = this.bindings.courseStudyProgresss.data || [],
            course = this.bindings.course.data || [],
            a = 0,
            mm = 0, // 分
            arr = [],
            study = {};
        _.map(courseStudyProgresss || [], function(m, i) {
            var e = m;
            var memberId = m.memberId;
            if (course.length > 0) {
                if (_.find(course, ['memberId', memberId])) {
                    e.studyTotalTime = _.find(course, ['memberId', memberId]).times;
                } else {
                    e.studyTotalTime = 0;
                }
            }
            e.i = i + 1;
            a = e.studyTotalTime == null ? 0 : window.parseInt(e.studyTotalTime);
            if (a > 60) {
                mm = window.parseInt(a / 60);
                e.studyTotalTime = mm;
            }
            if (a > 0 && a <= 60) {
                e.studyTotalTime = 1;
            }
            if (a === 0) {
                e.studyTotalTime = 0;
            }
        });
        courseStudyProgresss = _.orderBy(courseStudyProgresss, ['studyTotalTime'], ['desc']);
        if (courseStudyProgresss.length > 0) {
            arr = courseStudyProgresss;
        }
        _.map(arr || [], function(m, i) {
            var e = m;
            e.i = i + 1;
        });
        study.arr = arr;
        return study;
    }
};

exports.afterRender = function() {
    var me = this;
    if (me.bindings.courseStudyProgresss.data.length > 100) {
        $(this.$('nomore')).addClass('hide');
    }
};
