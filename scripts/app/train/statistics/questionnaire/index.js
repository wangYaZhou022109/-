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
        state: { data: { } }
    },
    callbacks: {
        init: function(payload) {
            var classEvaluates = this.models.classEvaluates,
                classEvaluate = this.models.classEvaluate;
            classEvaluates.params = payload;
            classEvaluate.params = payload;
            this.get(classEvaluate);
            return this.get(classEvaluates);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
