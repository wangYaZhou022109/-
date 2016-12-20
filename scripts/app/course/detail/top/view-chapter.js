var $ = require('jquery'),
    A = require('../../../util/animation'),
    courseUtil = require('../../course-util'),
    _ = require('lodash/collection');

exports.bindings = {
    course: true
};

exports.events = {
    'click note-btn': 'showNote',
    'click toggle-catalog': 'toggleCatalog'
};

exports.handlers = {
    showNote: function() {
        var courseSide = this.module.$('course-side-catalog');
        A.animate(courseSide, 'show-note');
    },

    toggleCatalog: function() {
        $(this.module.$('course-side-catalog')).toggleClass('collapse');
    }
};

exports.dataForTemplate = {
    course: function(data) {
        var course = data.course;
        if (course.addType === 1) {
            course.courseChapters = course.courseChapters[0];
        } else if (course.addType === 2) {
            _.forEach(course.courseChapters, function(item, i) {
                var r = item;
                r.seq = courseUtil.seqName(i, 1);
                _.forEach(r.courseChapterSections, function(obj, j) {
                    var rr = obj;
                    rr.seq = courseUtil.seqName(j, 2);
                });
            });
        }
        return data.course;
    }
};
