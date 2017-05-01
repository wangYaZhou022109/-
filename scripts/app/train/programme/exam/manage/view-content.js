var map = {
    1: 'review',
    2: 'invigilate',
    3: 'mark',
    4: 'question-recovery',
    5: 'retest'
};

exports.type = 'dynamic';

exports.bindings = {
    state: true,
    exam: true
};

exports.getEntity = function() {
    return this.bindings.exam.data;
};

exports.getEntityModuleName = function(id) {
    return 'exam/exam/manage/' + map[id];
};

exports.dataForEntityModule = function(data) {
    var me = this;
    return {
        id: this.bindings.exam.data.id,
        exam: data,
        callback: {
            updateMarkConfig: function(d) {
                me.bindings.exam.updateMarkConfig(d);
            }
        }
    };
};
