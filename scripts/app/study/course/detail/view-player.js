var util = require('./app/study/course/course-util');
exports.type = 'dynamic';

exports.bindings = {
    course: false,
    state: true,
};

exports.getEntity = function(key) {
    if (!key) return null;
    return this.bindings.course.findSection(key);
};

exports.getEntityModuleName = function(key, entity) {
    var code = 'default';
    if (entity) code = util.sectionCode[entity.sectionType];
    if (!code) code = 'default';

    return 'study/course/detail/player/' + code;
};

exports.dataForEntityModule = function(entity) {
    var me = this;
    return {
        state: this.bindings.state.data,
        section: entity,
        // refresh: function(course) { me.module.dispatch('refresh', course); },
        callback: function(data) {
            me.module.dispatch('updateProgress', data);
        },
        register: function() {
            me.module.dispatch('register');
        }
    };
};
