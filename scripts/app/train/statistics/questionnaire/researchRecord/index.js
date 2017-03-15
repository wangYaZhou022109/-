exports.items = {
    details: 'details',
    main: 'main',
    search: 'search',
    'train/statistics/questionnaire/researchRecord/research-detail': { isModule: true }
};

exports.store = {
    models: {
        researchQuestionarys: {
            url: '../train/questionnaireSurvey/researchRecord',
            type: 'pageable',
            root: 'items'
        },
        researchQuestionary: { url: '../train/questionnaireSurvey/researchQuestionary' },
        download: { url: '../train/questionnaireSurvey/researchRecordDownload' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var researchQuestionarys = this.models.researchQuestionarys,
                researchQuestionary = this.models.researchQuestionary,
                state = this.models.state.data;
            researchQuestionarys.params = {};
            researchQuestionarys.params.resourceId = payload.id;
            researchQuestionary.params.resourceId = payload.id;
            state.id = payload.id;
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
