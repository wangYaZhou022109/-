exports.type = 'tree-grid';
exports.searchView = 'filter';

exports.items = {
    content: 'content',
    filter: '',
    'train/programme/exam/paper/add-paper': {
        isModule: true
    },
    'train/programme/exam/paper/preview-paper': {
        isModule: true
    },
    'train/programme/exam/paper/mark-paper': {
        isModule: true
    },
    'train/programme/exam/paper/used-exam': {
        isModule: true
    }
};

exports.store = {
    models: {
        papers: {
            url: '../exam/paper-class',
            root: 'items',
            type: 'pageable'
        },
        paper: {
            url: '../exam/paper-class'
        },
        updateStatus: {
            url: '../exam/paper-class/update-status'
        }
    },
    callbacks: {
        doSearch: function(options) {
            this.module.setSearchOptions(options);
        },
        refreshList: function(options) {
            var model = this.models.papers;
            model.clear();
            model.params = options;
            this.get(model);
        },
        viewPaper: function(payload) {
            this.models.paper.set(payload);
            return this.get(this.models.paper);
        },
        publishPaper: function(payload) {
            this.models.updateStatus.set(payload);
            return this.put(this.models.updateStatus);
        },
        undoPaper: function(payload) {
            this.models.updateStatus.set(payload);
            return this.put(this.models.updateStatus);
        },
        selectQuestions: function(options) {
            return options;
        },
        removePaper: function(payload) {
            var me = this;
            this.models.paper.set(payload);
            this.del(this.models.paper).then(function() {
                me.app.message.success('操作成功');
                me.get(me.models.papers);
            });
        }
    }
};
