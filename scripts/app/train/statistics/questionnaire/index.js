exports.items = {
    mainA: 'mainA',
    'train/statistics/questionnaire/exam': { isModule: true },
    'train/statistics/questionnaire/researchRecord': { isModule: true },
    'train/statistics/questionnaire/researchAnswerRecord': { isModule: true }
};

exports.store = {
    models: {
        classEvaluates: {
            url: '../train/questionnaireSurvey/classEvaluate'
        },
        state: { data: { classId: 3 } }
    },
    callbacks: {
        init: function(payload) {
            var classEvaluates = this.models.classEvaluates;
            classEvaluates.params = payload;
            return this.get(classEvaluates);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
