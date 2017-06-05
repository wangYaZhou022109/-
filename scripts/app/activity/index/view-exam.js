var D = require('drizzlejs');

exports.bindings = {
    down: false,
    examMores: true
};

exports.events = {
    'click exam-*': 'showExamPrompt'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    showExamPrompt: function(id) {
        var mod = this.module.items['activity/index/exam-prompt'],
            me = this;
        me.app.viewport.modal(mod, { examId: id });
    }
};

exports.dataForTemplate = {
    examArray: function(data) {
        return data.examMores.examArray;
    }
};

exports.components = [function() {
    var me = this,
        examMores = this.bindings.examMores,
        obj = {
            id: 'swiper-3',
            name: 'swiper',
            options: {
                slider: true,
                translateLeft: function(page) {
                    return me.module.dispatch('changeExamPage', { page: page });
                },
                translateRight: function(page) {
                    return me.module.dispatch('pushMoreExams', { page: page });
                }
            }
        };
    if (examMores.data.page > 0) {
        D.assign(obj.options, {
            turnToPage: examMores.data.page,
        });
    }
    return obj;
}];
