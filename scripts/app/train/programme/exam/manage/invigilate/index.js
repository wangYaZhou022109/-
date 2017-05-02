var autoReloadTimer = '';

exports.items = {
    search: 'search',
    main: 'main',
    'error-handle': '',
    'picker/member/select-member': { isModule: true },
    'exam/paper/score-detail-paper': { isModule: true },
    'exam/paper/mark-paper': { isModule: true }
};

exports.store = {
    models: {
        examRecords: {
            url: '../exam/exam-record',
            type: 'pageable',
            root: 'items'
        },
        examRecord: { url: '../exam/exam-record' },
        forceSubmitPaper: { url: '../exam/exam-record/force-submit-paper' },
        exams: { url: '../exam/exam/exams' },
        user: { url: '../exam/exam-record/user' },
        addSubmitTime: { url: '../exam/exam-record/add-submit-time' },
        resetPaper: { url: '../exam/exam-record/reset' },
        params: { data: {} },
        exam: {},
        exportExamRecored: { url: '../exam/exam-record/export' }
    },
    callbacks: {
        init: function(payload) {
            this.models.examRecords.params = { examId: payload.id };
            this.models.exam.set(payload.exam);
            this.get(this.models.examRecords);
            this.models.exams.params = { id: payload.id };
            this.get(this.models.exams);
        },
        search: function(payload) {
            var data = payload || { status: 0 };
            if (Number(data.status) === 0) data.status = '';
            if (Number(data.type) === 0) data.type = '';
            if (!data.examId) {
                data.examId = this.module.renderOptions.id;
            }
            this.models.params.data = data;
            this.models.examRecords.params = data;
            this.get(this.models.examRecords);
        },
        remove: function(id) {
            var me = this;
            this.models.examRecord.set(id);
            this.del(this.models.examRecord).then(function() {
                me.app.message.success('操作成功');
                me.get(me.models.examRecords);
            });
        },
        forceSubmitPaper: function(id) {
            var me = this;
            me.models.forceSubmitPaper.set({ userId: id });
            return me.post(me.models.forceSubmitPaper).then(function() {
                me.app.message.success('交卷成功');
                return me.get(me.models.examRecords);
            });
        },
        addUserToExam: function(userId) {
            var me = this;
            me.models.user.set({ userId: userId, examId: me.module.renderOptions.id });
            return me.post(me.models.user);
        },
        addSubmitTime: function(data) {
            var me = this;
            me.models.addSubmitTime.set(data);
            return me.post(me.models.addSubmitTime);
        },
        reset: function(id) {
            var me = this;
            me.models.resetPaper.set({ examRecordId: id });
            me.post(me.models.resetPaper).then(function() {
                me.app.message.success('重置成功');
                me.get(me.models.examRecords);
            });
        },
        autoReload: function() {
            var me = this;
            return this.get(this.models.examRecords).then(function(data, error) {
                autoReloadTimer = setTimeout(function() {
                    me.module.dispatch('autoReload', error);
                }, 1000 * 60 * 2);
            });
        }
    }
};

exports.afterRender = function() {
    var me = this;
    return this.dispatch('init', this.renderOptions).then(function() {
        me.dispatch('autoReload');
    });
};
exports.afterClose = function() {
    window.clearTimeout(autoReloadTimer);
};
