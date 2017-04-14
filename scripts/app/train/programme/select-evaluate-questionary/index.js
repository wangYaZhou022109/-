var D = require('drizzlejs'),
    titleType = { ADD: 'add', EDIT: 'edit' };

exports.RESEARCH_TYPE = 3;

exports.items = {
    search: 'search',
    content: 'content',
    'train/trainee/select-member-radio': { isModule: true },
    'train/programme/select-evaluate-questionary/add-research-refrence': { isModule: true }
};

exports.title = '添加评估';

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
            if (payload.researchId) {
                this.models.research.set({ id: payload.researchId });
            }

            D.assign(this.models.researchActivities.params, {
                type: this.module.options.RESEARCH_TYPE
            });
            return this.get(this.models.researchActivities);
        },
        search: function(payload) {
            var researchActivities = this.models.researchActivities;
            researchActivities.clear();
            researchActivities.params = payload;
            researchActivities.params.type = this.module.options.RESEARCH_TYPE;
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
        var mod = this.items['train/programme/select-evaluate-questionary/add-research-refrence'],
            researchId = this.store.models.research.data.id,
            me = this;
        this.app.viewport.modal(mod, {
            researchId: researchId,
            titleType: researchId ? titleType.EDIT : titleType.ADD,
            callback: function(data) {
                var callback = me.renderOptions.callback;
                return me.dispatch('init', {}).then(function() {
                    if (callback) callback(data);
                });
            }
        });
        return false;
    }
}];

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
