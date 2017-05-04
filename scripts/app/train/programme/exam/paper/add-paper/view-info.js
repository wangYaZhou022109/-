exports.title = '新增试卷';
// exports.type = 'form';

exports.events = {
    'click select-question': 'selectQuestion',
    'click temporary-question': 'temporaryQuestion',
    'click import-question': 'importQuestion'
};

exports.bindings = {
    paper: true
};

exports.dataForActions = {
    savePaper: function(data) {
        return this.validate() ? data : false;
    }
};
exports.handlers = {
    selectQuestion: function() {
        var me = this;
        this.app.viewport.modal(this.module.items['train/programme/exam/question/select-question'], {
            name: '',
            callback: {
                addQuestionClass: function(data) {
                    return me.module.dispatch('addQuestionClass', data);
                },
                addQuestionClasses: function(data) {
                    return me.module.dispatch('addQuestionClasses', data);
                },
                removeQuestionClass: function(data) {
                    return me.module.dispatch('removeQuestionClass', data);
                },
                removeQuestionClasses: function(data) {
                    return me.module.dispatch('removeQuestionClasses', data);
                },
                getQuestionIds: function() {
                    return me.bindings.paper.getQuestionIds();
                }
            }
        });
    },
    temporaryQuestion: function() {
        var me = this;
        this.app.viewport.modal(this.module.items['train/programme/exam/question/add-question'], {
            callback: function(data) {
                return me.module.dispatch('addQuestionClass', data);
            },
            interim: true,
            titleType: 'add'
        });
    },
    importQuestion: function() {
        var me = this;
        this.app.viewport.modal(this.module.items['train/programme/exam/question/import-data'], {
            callback: function(data) {
                return me.module.dispatch('addQuestionClass', data);
            },
        });
    }
};
