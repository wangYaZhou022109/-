exports.type = 'dynamic';

exports.bindings = {
    state: true,
    courseChapterSection: false,
    courseSectionStudyProgress: false
};

exports.getEntityModuleName = function(key) {
    return 'course/detail/top/' + key;
};

exports.getEntity = function() {
    return {
        courseChapterSection: this.bindings.courseChapterSection.data,
        courseSectionStudyProgress: this.bindings.courseSectionStudyProgress.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
