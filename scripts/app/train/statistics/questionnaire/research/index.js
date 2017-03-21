exports.items = {
    details: 'details',
    main: 'main',
    search: 'search'
};

exports.large = true;

exports.store = {
    models: {
        researchQuestionarys: {
            url: '../train/questionnaire-survey/research',
            type: 'pageable',
            root: 'items'
        },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var researchQuestionarys = this.models.researchQuestionarys,
                state = this.models.state.data;
            researchQuestionarys.params = {};
            researchQuestionarys.params.resourceId = payload.id;
            researchQuestionarys.params.classId = payload.classId.classId;
            state.id = payload.id;
            state.classId = payload.classId.classId;
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
