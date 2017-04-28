
exports.bindings = {
    classEvaluates: true,
    state: true
};

exports.dataForTemplate = {
    classEvaluates: function(data) {
        var classEvaluates = data.classEvaluates;
        return classEvaluates;
    }
};

exports.events = {
    'click edit-classEvaluates*': 'editClassEvaluates',
};

exports.handlers = {
    editClassEvaluates: function(data, e, target) {
        var me = this;
        var typeId = target.getAttribute('typeId');
        var view1 = me.module.items['train/statistics/questionnaire/exam'];
        var view2 = me.module.items['train/statistics/questionnaire/research-record'];
        var view3 = me.module.items['train/statistics/questionnaire/research-answer-record'];
        var options = {};
        options.id = data;
        options.type = typeId;
        options.classId = this.bindings.state.data.classId;
        if (typeId === '1') {
            this.app.viewport.modal(view1, { payload: options });
        }
        if (typeId === '2') {
            this.app.viewport.modal(view2, { payload: options });
        }
        if (typeId === '3') {
            this.app.viewport.modal(view3, { payload: options });
        }
    }
};
