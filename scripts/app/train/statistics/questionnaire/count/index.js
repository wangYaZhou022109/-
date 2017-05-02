exports.items = {
    head: 'head',
    list: 'list',
    menu: 'menu'
};

exports.store = {
    models: {
        cla: {
            url: '../train/class-info/get',
        },
        allA: {
            url: '../train/questionnaire-survey/count-a',
        },
        allB: {
            url: '../train/questionnaire-survey/count-b',
        },
        all: {
            url: '../train/questionnaire-survey/count-zong',
        },
        downloadA: { url: '../train/questionnaire-survey/download/count-a' },
        downloadB: { url: '../train/questionnaire-survey/download/count-b' },
        downloadC: { url: '../train/questionnaire-survey/download/count-c' },
        downloadZ: { url: '../train/questionnaire-survey/download/count-z' },
        state: { data: {} },
    },
    callbacks: {
        init: function(payload) {
            var cla = this.models.cla,
                allA = this.models.allA,
                allB = this.models.allB,
                classId = payload,
                state = this.models.state;
            cla.params = { id: classId };
            allA.params = { classId: classId };
            allB.params = { classId: classId };
            state.data = {};
            state.data.menu = 'news';
            state.data.classId = payload;
            state.changed();
            this.get(allA);
            this.get(allB);
            return this.get(cla);
        },
    }
};

exports.beforeRender = function() {
    var me = this;
    me.dispatch('init', this.renderOptions.classId);
};

