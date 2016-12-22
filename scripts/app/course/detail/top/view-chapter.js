var $ = require('jquery'),
    A = require('../../../util/animation'),
    courseUtil = require('../../course-util'),
    _ = require('lodash/collection');

exports.bindings = {
    course: true
};

exports.events = {
    'click note-btn': 'showNote',
    'click toggle-catalog': 'toggleCatalog',
    'click showsection-*': 'showSection'
};

exports.handlers = {
    showNote: function() {
        var courseSide = this.module.$('course-side-catalog');
        A.animate(courseSide, 'show-note');
    },

    toggleCatalog: function() {
        $(this.module.$('course-side-catalog')).toggleClass('collapse');
    },
    showSection: function(id, events, element) {
        var chapterId = element.getAttribute('data-chapter-id');
        this.module.dispatch('showSection', { sectionId: id, chapterId: chapterId });
    }
};

exports.dataForTemplate = {
    course: function(data) {
        var course = data.course;
        _.forEach(course.courseChapters, function(item, i) {
            var r = item;
            r.seq = courseUtil.seqName(i, 1);
            _.forEach(r.courseChapterSections, function(obj, j) {
                var rr = obj;
                rr.seq = courseUtil.seqName(j, 2);
            });
        });
        return data.course;
    }
};
