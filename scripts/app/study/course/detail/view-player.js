exports.type = 'dynamic';

exports.bindings = {
    course: false,
    state: true,
    section: true,
    sectionProgress: true
};

exports.getEntityModuleName = function(key) {
    return 'study/course/detail/player/' + key;
};

exports.getEntity = function() {
    var me = this;
    return {
        course: this.bindings.course.data,
        section: this.bindings.section.data,
        sectionProgress: this.bindings.sectionProgress.data,
        refresh: function(course) {
            me.module.dispatch('refresh', course);
        },
        refreshProgress: function(studyProgress) {
            me.module.dispatch('refreshProgress', studyProgress);
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
