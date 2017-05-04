exports.title = '考试发布';

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        exam: { url: '../exam/exam' },
        exampublish: { url: '../exam/exam/exam-publish' },
    },
    callbacks: {
        init: function(id) {
            var exam = this.models.exam;
            exam.data = { id: id };
            this.get(exam);
        },
        publish: function() {
            var publish = this.models.exampublish,
                exam = this.models.exam;
            publish.data = { id: exam.data.id };
            return this.save(publish);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.id);
};

exports.buttons = function() {
    return [
        {
            text: '发布',
            fn: function() {
                var that = this;
                this.dispatch('publish').then(function() {
                    that.renderOptions.callback && that.renderOptions.callback();
                });
            }
        }
    ];
};
