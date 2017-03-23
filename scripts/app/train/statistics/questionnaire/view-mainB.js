
exports.bindings = {
    classEvaluate: true,
    state: true
};

exports.dataForTemplate = {
    classEvaluate: function(data) {
        var classEvaluate = data.classEvaluate;
        return classEvaluate;
    }
};

exports.events = {
    'click edit-classEvaluates*': 'editClassEvaluates',
    'click statistics*': 'statistics',
};

exports.handlers = {
    editClassEvaluates: function(data) {
        var me = this,
            classId = this.bindings.state.data,
            view4 = me.module.items['train/statistics/questionnaire/research'],
            options = {};
        options.id = data;
        options.classId = classId;
        this.app.viewport.modal(view4, { payload: options });
    }
};
