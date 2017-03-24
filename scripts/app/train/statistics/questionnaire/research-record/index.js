exports.items = {
    details: 'details',
    main: 'main',
    search: 'search',
    'exam/research-activity/research-answer-detail': { isModule: true },
    'train/statistics/questionnaire/research-record/summary': { isModule: true }
};

exports.large = true;

exports.store = {
    models: {
        researchQuestionarys: {
            url: '../train/questionnaire-survey/research-record',
            type: 'pageable',
            root: 'items'
        },
        researchQuestionary: { url: '../train/questionnaire-survey/research-questionary' },
        download: { url: '../train/questionnaire-survey/research-record-download' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var researchQuestionarys = this.models.researchQuestionarys,
                researchQuestionary = this.models.researchQuestionary,
                state = this.models.state;
            researchQuestionarys.params = {};
            researchQuestionarys.params.resourceId = payload.id;
            researchQuestionarys.params.classId = payload.classId.classId;
            researchQuestionary.params.resourceId = payload.id;
            researchQuestionary.params.classId = payload.classId.classId;
            state.data.resourceId = payload.id;
            state.data.classId = payload.classId.classId;
            researchQuestionary.clear();
            this.get(researchQuestionary);
            return this.get(researchQuestionarys);
        },
        search: function(payload) {
            var researchQuestionarys = this.models.researchQuestionarys;
            researchQuestionarys.params = payload;
            return this.get(researchQuestionarys);
        }
    }
};


exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.payload);
};
