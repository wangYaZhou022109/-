exports.items = {
    mainA: 'mainA',
    mainB: 'mainB'
};

exports.store = {
    models: {
        allA: {
            url: '../train/questionnaire-survey/count-a',
        },
        allB: {
            url: '../train/questionnaire-survey/count-b',
        },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var allA = this.models.allA,
                allB = this.models.allB,
                classId = payload.state.data.classId;
            allA.params = { classId: classId };
            allB.params = { classId: classId };
            this.get(allB);
            return this.get(allA);
        },
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions);
};

