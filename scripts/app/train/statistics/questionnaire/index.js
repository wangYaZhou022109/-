exports.items = {
    mainA: 'mainA',
    'train/statistics/questionnaire/exam': { isModule: true },
    'train/statistics/questionnaire/research-record': { isModule: true },
    'train/statistics/questionnaire/research-answer-record': { isModule: true }
};

exports.store = {
    models: {
        classEvaluates: {
            url: '../train/questionnaire-survey/class-evaluate'
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
