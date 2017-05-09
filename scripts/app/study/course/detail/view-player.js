var sectionCode = {
    1: 'pdf',
    2: 'image',
    3: 'url',
    5: 'audio-new',
    6: 'video',
    7: 'epub',
    12: 'research',
    13: 'questionary'
};
exports.type = 'dynamic';

exports.bindings = {
    course: false,
    playerState: true,
    progress: false
};

exports.getEntity = function(key) {
    if (!key) return null;
    return this.bindings.course.findSection(key);
};

exports.getEntityModuleName = function(key, entity) {
    var code = 'default';
    if (!entity) {
        code = 'regist';
    } else {
        code = sectionCode[entity.sectionType] || 'default';
    }
    return 'study/course/detail/player/' + code;
};

exports.dataForEntityModule = function(entity) {
    var me = this;
    if (entity == null) {
        return {
            state: this.bindings.playerState.data
        };
    }
    return {
        state: this.bindings.playerState.data,
        section: entity,
        progress: this.bindings.progress.findProgress(entity.referenceId),
        // refresh: function(course) { me.module.dispatch('refresh', course); },
        mediaProgress: function(data) {
            return me.module.dispatch('mediaProgress', data).then(function() {
                return me.module.dispatch('updateProgress');
            });
        },
        docProgress: function(data) {
            return me.module.dispatch('docProgress', data).then(function() {
                return me.module.dispatch('updateProgress');
            });
        },
    };
};
