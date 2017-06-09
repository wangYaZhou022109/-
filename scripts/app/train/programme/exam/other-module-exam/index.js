var D = require('drizzlejs'),
    REMOTE_COURSE_TYPE = 2,
    strings = require('./app/util/strings');

exports.title = function() {
    return this.renderOptions.id ? '修改考试' : '添加考试';
};

exports.large = true;

exports.items = {
    main: 'main',
    paper: 'paper'
};

exports.store = {
    models: {
        exam: { url: '../exam/exam' },
        otherModuelExam: { url: '../exam/exam/other-module-exam' }
    },
    callbacks: {
        init: function(payload) {
            var me = this;
            if (payload.id) {
                this.models.exam.data = { id: payload.id };
                return this.get(this.models.exam).then(function() {
                    if (payload.name) D.assign(me.models.exam.data, { name: payload.name });
                    me.models.exam.changed();
                });
            }
            return '';
        },
        save: function(payload) {
            var otherModuelExam = this.models.otherModuelExam,
                exam = this.models.exam,
                me = this;
            D.assign(otherModuelExam.data, exam.data, payload);
            return this.save(otherModuelExam).then(function() {
                me.app.message.success(strings.get('save-success'));
            });
        },
        changeName: function(payload) {
            var paper = this.module.items.paper.getEntities()[0];
            D.assign(this.models.exam.data, payload);
            paper.setData(payload);
        }
    }
};

exports.beforeRender = function() {
    var exam = this.store.models.exam,
        otherModuelExam = this.store.models.otherModuelExam;

    exam.clear();
    otherModuelExam.clear();
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: '保存',
    fn: function(payload) {
        var that = this,
            callback = that.renderOptions.callback,
            paperItem = this.items.paper.getEntities()[0],
            paperData = paperItem.getData(),
            inputScore,
            main = this.items.main;

        if (!payload.paperClassId) {
            that.app.message.error('请选择试卷');
        }
        if (!paperItem.isValidator()) {
            return false;
        }

        inputScore = 0;

        if (main.validate() && main.check()) {
            if (payload.paperClassId) {
                inputScore = payload.passScore * 100;
                if (inputScore > paperData.paperClass.totalScore) {
                    this.app.message.error('及格分数不得大于试卷分数');
                    return false;
                }
                D.assign(payload, paperData, {
                    sourceType: that.renderOptions.sourceType || REMOTE_COURSE_TYPE
                });
                return this.store.module.dispatch('save', payload).then(function() {
                    var examData = D.assign(that.store.models.otherModuelExam.data, payload);
                    callback && callback(examData);
                });
            }
            this.app.message.error('请选择试卷');
        }
        return false;
    }
}];
