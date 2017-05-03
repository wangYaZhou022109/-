var D = require('drizzlejs'),
    PAPER_MODULE = 'train/programme/exam/exam-edit/steps/step-4',
    REMOTE_COURSE_TYPE = 2;

exports.title = function() {
    return this.renderOptions.id ? '修改考试' : '添加考试';
};

exports.large = true;

exports.items = {
    main: 'main',
    'train/programme/exam/exam-edit/steps/step-4': { isModule: true }
};

exports.store = {
    models: {
        exam: { url: '../exam/exam' },
        otherModuelExam: { url: '../exam/exam/other-module-exam' }
    },
    callbacks: {
        init: function(payload) {
            if (payload.id) {
                this.models.exam.data = { id: payload.id };
                return this.get(this.models.exam);
            }
            return this.models.exam.clear();
        },
        save: function(payload) {
            var otherModuelExam = this.models.otherModuelExam,
                exam = this.models.exam,
                me = this;
            D.assign(otherModuelExam.data, exam.data, payload);
            return this.save(otherModuelExam).then(function() {
                me.app.message.success('操作成功！');
            });
        }
    }
};

exports.afterRender = function() {
    var that = this;
    return this.store.module.dispatch('init', this.renderOptions).then(function() {
        var paperItem = that.items[PAPER_MODULE];
        that.regions.paper.show(paperItem, {
            exam: that.store.models.exam.data || {}
        });
    });
};

exports.buttons = [{
    text: '保存',
    fn: function(payload) {
        var that = this,
            callback = that.renderOptions.callback,
            paperItem = this.items[PAPER_MODULE],
            paperData = paperItem.getData(),
            inputScore;

        if (!paperItem.isValidator()) {
            return false;
        }

        inputScore = 0;

        if (that.items.main.validate()) {
            if (payload.paperClassId) {
                inputScore = payload.passScore * 100;
                if (inputScore > paperData.paperClass.totalScore) {
                    that.app.message.error('及格分数不得大于试卷分数');
                    return false;
                }
                D.assign(payload, paperData, {
                    sourceType: that.renderOptions.sourceType || REMOTE_COURSE_TYPE
                });
                return that.store.module.dispatch('save', payload).then(function() {
                    var examData = D.assign(that.store.models.otherModuelExam.data, payload, { isAdd: 1 });
                    callback && callback(examData);
                });
            }
            that.app.message.error('请选择试卷');
        }
        return false;
    }
}];
