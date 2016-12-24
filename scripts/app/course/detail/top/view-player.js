exports.type = 'dynamic';

exports.bindings = {
    course: false,
    state: true,
    section: false,
    sectionProgress: false
};

exports.getEntityModuleName = function(key) {
    return 'course/detail/top/' + key;
};

exports.getEntity = function() {
    return {
        course: this.bindings.course.data,
        section: this.bindings.section.data,
        sectionProgress: this.bindings.sectionProgress.data
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
