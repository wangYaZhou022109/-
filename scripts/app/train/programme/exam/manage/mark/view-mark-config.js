exports.type = 'dynamic';

exports.bindings = {
    markConfig: true,
    exam: true
};

exports.getEntity = function() {
    return {
        paperClass: this.bindings.exam.data.paperClass,
        markConfig: this.bindings.markConfig.data,
        exam: this.bindings.exam.data
    };
};

exports.getEntityModuleName = function() {
    return 'exam/exam/mark-config';
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        data: data,
        callback: function(markConfig) {
            me.bindings.markConfig.save(markConfig);
        }
    };
};
