exports.items = {
    details: 'details',
    main: 'main',
    search: 'search',
    'exam/research-activity/research-answer-detail': { isModule: true }
};


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
                state = this.models.state.data;
            researchQuestionarys.params = {};
            researchQuestionarys.params.resourceId = payload.id;
            researchQuestionary.params.resourceId = payload.id;
            state.id = payload.id;
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
