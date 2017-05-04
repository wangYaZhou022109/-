exports.title = '关联考试';

exports.items = {
    content: 'content'
};

exports.store = {
    models: {
        exams: { url: '../exam/exam', type: 'pageable', root: 'items' },
        exam: { url: '../exam/exam' }
    },
    callbacks: {
        init: function(params) {
            this.models.exams.params = params;
            this.get(this.models.exams);
        }
    }

};

exports.afterRender = function() {
    var me = this;
    if (me.renderOptions.paperClassId) {
        me.dispatch('init', { paperClassId: me.renderOptions.paperClassId });
    }
};
