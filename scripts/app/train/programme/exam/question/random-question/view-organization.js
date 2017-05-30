exports.type = 'dynamic';

exports.getEntity = function() {
    return '';
};

exports.getEntityModuleName = function() {
    return 'train/programme/exam/question/random-question/organization-tree';
};

exports.dataForEntityModule = function() {
    var me = this;
    return {
        callback: function(data) {
            return me.module.nodeChanged(data);
        }
    };
};
