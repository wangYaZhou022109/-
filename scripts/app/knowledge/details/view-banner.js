exports.type = 'dynamic';

exports.bindings = {
    knowledge: true
};

exports.getEntity = function() {
    return this.bindings.knowledge.data;
};

exports.getEntityModuleName = function() {
    var knowledge = this.bindings.knowledge.data;
    if (knowledge.type === 0) {
        return 'knowledge/details/player/video';
    }
    if (knowledge.type === 1) {
        return 'knowledge/details/player/audio';
    }
    return 'knowledge/details/player/pdf';
};

exports.dataForEntityModule = function(entity) {
    return entity;
};
