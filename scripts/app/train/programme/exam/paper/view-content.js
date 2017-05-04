var _ = require('lodash/collection');

exports.bindings = {
    papers: true,
    search: 'searchChange'
};

exports.components = [{
    id: 'pager',
    name: 'pager',
    options: {
        model: 'papers'
    }
}];

exports.events = {
    'click add-paper': 'addPaper',
    'click edit-paper-*': 'editPaper',
    'click copy-paper-*': 'copyPaper',
    'click preview-paper-*': 'previewPaper',
    'click mark-paper': 'markPaper',
    'click exam-count-*': 'openExamCount'
};

exports.actions = {
    'click publish-paper-*': 'publishPaper',
    'click undo-paper-*': 'undoPaper',
    'click remove-paper-*': 'removePaper'
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};

exports.dataForTemplate = {
    papers: function(data) {
        var pageNum = this.bindings.papers.getPageInfo().page;
        return _.map(data.papers || [], function(p, i) {
            var paper = p;
            paper.i = i + 1 + ((pageNum - 1) * 10);
            paper.pb = paper.status === 0;
            paper.totalScore = p.totalScore / 100;
            return paper;
        });
    }
};

exports.handlers = {
    addPaper: function() {
        var item = this.module.items['train/programme/exam/paper/add-paper'],
            me = this,
            params = me.module.store.models.papers.params;
        this.app.viewport.ground(item, {
            callback: function() {
                me.app.viewport.closeGround();
                me.module.dispatch('refreshList', params);
            }
        });
    },
    editPaper: function(id) {
        var item = this.module.items['train/programme/exam/paper/add-paper'],
            me = this,
            params = me.module.store.models.papers.params;
        me.app.viewport.ground(item, {
            id: id,
            isEdit: true,
            callback: function() {
                me.app.viewport.closeGround();
                me.module.dispatch('refreshList', params);
            }
        });
    },
    copyPaper: function(id) {
        var item = this.module.items['train/programme/exam/paper/add-paper'],
            me = this,
            params = me.module.store.models.papers.params;
        this.app.viewport.ground(item, {
            id: id,
            isCopy: true,
            callback: function() {
                me.app.viewport.closeGround();
                me.module.dispatch('refreshList', params);
            }
        });
    },
    previewPaper: function(id) {
        this.app.viewport.ground(this.module.items['train/programme/exam/paper/preview-paper'], { paperId: id });
    },
    openExamCount: function(id) {
        this.app.viewport.modal(this.module.items['train/programme/exam/paper/used-exam'], { paperClassId: id });
    }
};

exports.dataForActions = {
    publishPaper: function(payload) {
        var me = this,
            data = payload,
            message = '是否确定发布试卷?';
        data.status = 1;
        return me.Promise.create(function(resolve) {
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    undoPaper: function(payload) {
        var me = this,
            data = payload,
            message = '撤销后将无法引用该试卷，是否确定撤销该试卷?';
        data.status = 0;
        return me.Promise.create(function(resolve) {
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    removePaper: function(payload) {
        var me = this,
            data = payload,
            message = '确定删除该试卷?';
        return me.Promise.create(function(resolve) {
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    publishPaper: function() {
        this.app.message.success('发布成功!');
        this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
    },
    undoPaper: function() {
        this.app.message.success('撤销成功!');
        this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
    }
};
