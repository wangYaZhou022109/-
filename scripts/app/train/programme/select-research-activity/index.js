var D = require('drizzlejs'),
    titleType = { ADD: 'add', EDIT: 'edit' };

exports.items = {
    search: 'search',
    content: 'content',
    'train/trainee/select-member-radio': { isModule: true },
    'train/programme/research-activity/add-research-third-party': { isModule: true }
};

exports.title = '选择问卷';

exports.store = {
    models: {
        search: {},
        researchActivities: {
            url: '../exam/research-activity/find-for-course',
            type: 'pageable',
            root: 'items'
        },
        research: {}
    },
    callbacks: {
        init: function(payload) {
            if (payload.searchType) {
                this.models.research.set({ searchType: payload.searchType });
            }

            D.assign(this.models.researchActivities.params, {
                type: payload.searchType
            });
            return this.get(this.models.researchActivities);
        },
        search: function(payload) {
            var researchActivities = this.models.researchActivities,
                research = this.models.research.data;
            researchActivities.clear();
            researchActivities.params = payload;
            researchActivities.params.type = research.searchType;
            this.get(researchActivities);
        }
    }
};

exports.buttons = [{
    text: '选择',
    fn: function() {
        var callback = this.renderOptions.callback,
            content = this.items.content;
        if (!content.getData()) {
            this.app.message.error('请选择数据');
            return false;
        }
        if (callback) callback(content.getData());
        return true;
    }
}, {
    text: '新增',
    fn: function() {
        var mod = this.items['train/programme/research-activity/add-research-third-party'],
            researchId = this.store.models.research.data.id,
            me = this;
        this.app.viewport.modal(mod, {
            researchId: researchId,
            titleType: researchId ? titleType.EDIT : titleType.ADD,
            callback: function(data) {
                var callback = me.renderOptions.callback;
                if (callback) callback(data);
            }
        });
        return false;
    }
}];

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
