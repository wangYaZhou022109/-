exports.type = 'dynamic';

exports.bindings = {
    course: false,
    state: true,
    section: true,
    sectionProgress: true
};

exports.getEntityModuleName = function(key) {
    return 'course/detail/player/' + key;
};

exports.getEntity = function() {
    var me = this;
    return {
        course: this.bindings.course.data,
        section: this.bindings.section.data,
        sectionProgress: this.bindings.sectionProgress.data,
        refresh: function() {
            me.module.dispatch('init', { id: me.module.renderOptions.id });
        }
    };
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
