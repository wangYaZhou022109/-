var D = require('drizzlejs');

exports.title = '试题管理';

exports.searchView = 'filter';

exports.type = 'normal-grid';

exports.items = {
    content: 'content',
    filter: '',
    'train/programme/exam/question-depot/question-depot-tree': { isModule: true }
};

exports.store = {
    models: {
        organization: {
            url: '../system/grant/granted-organization',
            params: function() {
                return {
                    uri: this.app.global.uri,
                    level: '3'
                };
            }
        },
        questionDepot: { url: '../exam/question-depot' },
        state: {
            data: {}
        },
        search: {},
        toolbox: {}
    },
    callbacks: {
        init: function() {
            var content = this.module.items.content,
                mod = content.getEntities()[0],
                search = this.models.search.data;

            if (search.questionDepotId === 'root') {
                search.questionDepotId = null;
            }
            mod.refreshList(search);
        },
        edit: function(payload) {
            this.models.questionDepot.set(payload);
            this.get(this.models.questionDepot);
        },
        save: function(payload) {
            var questionDepot = this.models.questionDepot;
            questionDepot.set(payload);
            return this.save(questionDepot);
        },
        delete: function(payload) {
            var questionDepot = this.models.questionDepot;
            questionDepot.set(payload);
            return this.del(questionDepot);
        },
        doSearch: function(payload) {
            D.assign(this.models.search.data, payload);
            this.models.search.changed();
        },
        refreshList: function(payload) {
            var content = this.module.items.content,
                mod = content.getEntities()[0],
                search = this.models.search.data;
            D.assign(this.models.search.data, payload);
            if (search.questionDepotId === 'root') {
                search.questionDepotId = null;
            }
            mod.refreshList(search);
        }
    }
};

exports.beforeRender = function() {
    var me = this;
    this.initLeftDynamicData({
        dynamicEntity: {},
        moduleName: 'exam/question-depot/question-depot-tree',
        moduleData: {
            data: {},
            callback: function(data) {
                return me.dispatch('doSearch', data);
            }
        }
    });
};

exports.afterRender = function() {
    return this.dispatch('init');
};
