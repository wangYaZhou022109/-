var _ = require('lodash/collection');

exports.bindings = {
    courseStudyProgresss: true,
    members: true,
    course: true,
    down: true
};

exports.dataForTemplate = {
    study: function() {
        var courseStudyProgresss = this.bindings.courseStudyProgresss.data || [],
            course = this.bindings.course.data || [],
            a = 0,
            mm = 0, // 分
            defultImg = 'images/default-userpic.png',
            downUrl = this.bindings.down.getFullUrl(),
            arr = [],
            arr1 = [],
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
            if (e.member) {
                e.headPhoto = e.member.headPortrait ? (downUrl + '?id=' + e.member.headPortrait) : defultImg;
            }
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
            arr = courseStudyProgresss.slice(0, 3);
        }
        if (courseStudyProgresss.length > 3) {
            arr1 = courseStudyProgresss.slice(3);
        }
        _.map(arr || [], function(m, i) {
            var e = m;
            e.i = i + 1;
            e.class = 'charts0' + e.i;
        });
        _.map(arr1 || [], function(m, i) {
            var e = m;
            e.i = i + 4;
        });
        study.arr = arr;
        study.arr1 = arr1;
        return study;
    }
};
