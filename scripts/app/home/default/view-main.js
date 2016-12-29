var itemsMap = {
    lecture: 'home/default/lecture',
    ranklist: 'home/default/ranking',
    'expert-list': 'home/default/lecture',
    'hot-course': 'home/default/online-course',
    'course-build': 'home/default/online-course',
    'recommend-course': 'home/default/online-course',
    'new-course': 'home/default/online-course',
    'recommend-activity': 'home/default/recommend-activity',
    'study-subject': 'home/default/study-subject'
};

module.exports = {
    type: 'dynamic',
    bindings: { modules: true },
    beforeRender: function() {
        var moduleMap = {},
            modules = this.bindings.modules.data;
        modules.length && modules.forEach(function(m) {
            moduleMap[m.id] = m;
        });
        this.moduleMap = moduleMap;
    },
    getEntity: function(id) {
        var mod = this.moduleMap[id];
        return mod || {};
    },
    dataForEntityModule: function(data) {
        return data;
    },
    getEntityModuleName: function(id) {
        var mod = this.moduleMap[id];
        return itemsMap[mod && mod.moduleCode];
    },
};
