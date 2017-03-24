exports.items = {
    mainA: 'mainA',
    mainB: 'mainB',
    'train/statistics/questionnaire/exam': { isModule: true },
    'train/statistics/questionnaire/research-record': { isModule: true },
    'train/statistics/questionnaire/research-answer-record': { isModule: true },
    'train/statistics/questionnaire/research': { isModule: true }
};

exports.store = {
    models: {
        classEvaluates: {
            url: '../train/questionnaire-survey/class-evaluate'
        },
        classEvaluate: {
            url: '../train/questionnaire-survey/find'
        },
        updateManYi: {
            url: '../train/questionnaire'
        },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var classEvaluates = this.models.classEvaluates,
                classEvaluate = this.models.classEvaluate,
                state = this.models.state;
            classEvaluates.params = payload;
            classEvaluate.params = payload;
            state.data.classId = payload;
            this.get(classEvaluate);
            return this.get(classEvaluates);
        },
        updateStartTime: function(payload) {
            var model = this.models.updateManYi,
                classEvaluate = this.models.classEvaluate,
                me = this;
            model.clear();
            model.set(payload);
            this.save(model).then(function() {
                me.get(classEvaluate);
            });
        },
        updateEndTime: function(payload) {
            var model = this.models.updateManYi,
                classEvaluate = this.models.classEvaluate,
                me = this;
            model.clear();
            model.set(payload);
            this.save(model).then(function() {
                me.get(classEvaluate);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
