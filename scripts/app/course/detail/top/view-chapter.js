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
    showSection: function(id) {
        var section = this.bindings.course.data.sections[id],
            sectionType = section.sectionType,
            url = section.url;
        switch (sectionType) {
        case 1:
        case 5:
        case 6:
            this.module.dispatch('showSection', { sectionId: id });
            break;
        case 2:
            break;
        case 3:
            window.open(url);
            break;
        case 7:
            break;
        case 8:
            window.open('http://www.baidu.com');
            break;
        case 9:
            break;
        case 12:
            break;
        default:
        }
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
