exports.items = {
    details: 'details',
    main: 'main',
    search: 'search',
    'train/statistics/questionnaire/research-record/summary': { isModule: true }
};

exports.large = true;

exports.store = {
    models: {
        researchQuestionarys: {
            url: '../exam/research-record',
            type: 'pageable',
            root: 'items'
        },
        researchQuestionary: { url: '../exam/research-activity/simple-data' },
        download: { url: '../train/questionnaire-survey/research-record-download' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var researchQuestionarys = this.models.researchQuestionarys,
                researchQuestionary = this.models.researchQuestionary,
                state = this.models.state;
            researchQuestionarys.params = {};
            researchQuestionarys.params.researchQuestionaryId = payload.resourceId;
            researchQuestionarys.params.businessId = payload.classId.classId;
            researchQuestionary.clear();
            researchQuestionary.set({ id: payload.resourceId });
            researchQuestionary.params.businessId = payload.classId.classId;
            state.data.resourceId = payload.resourceId;
            state.data.classId = payload.classId.classId;
            this.get(researchQuestionary);
            return this.get(researchQuestionarys);
        },
        search: function(payload) {
            var researchQuestionarys = this.models.researchQuestionarys;
            researchQuestionarys.params = payload;
            researchQuestionarys.clear();
            return this.get(researchQuestionarys);
        }
    }
};


exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.payload);
};
