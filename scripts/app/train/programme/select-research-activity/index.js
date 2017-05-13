var D = require('drizzlejs'),
    titleType = { ADD: 'add', EDIT: 'edit' },
    EXAM_SOURCE_TYPE = 1;

exports.RESEARCH_TYPE = 2;

exports.SELECT_MODULE = 'train/programme/research-activity/add-research-third-party';

exports.items = {
    search: 'search',
    content: 'content',
    'train/trainee/select-member-radio': { isModule: true },
    'train/programme/research-activity/add-research-third-party': { isModule: true },
    'train/programme/research-activity/preview-questionary': { isModule: true }
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
            var research = this.models.research;
            if (payload.researchId) {
                this.models.research.set({ id: payload.researchId });
            }

            D.assign(this.models.researchActivities.params, {
                type: this.module.options.RESEARCH_TYPE,
                uri: this.app.global.uri
            });

            D.assign(research.data, {
                sourceType: payload.sourceType || EXAM_SOURCE_TYPE
            });
            return this.get(this.models.researchActivities);
        },
        search: function(payload) {
            var createTimeRange = payload.createTime || 'to';
            D.assign(this.models.researchActivities.params || {}, payload, {
                createTimeStart: createTimeRange.split('to')[0].trim(),
                createTimeEnd: createTimeRange.split('to')[1].trim()
            });
            return this.get(this.models.researchActivities);
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
        if (callback) callback(D.assign(content.getData(), { isAdd: 0 }));
        return true;
    }
}, {
    text: '新增',
    fn: function() {
        var mod = this.items[this.options.SELECT_MODULE],
            research = this.store.models.research.data,
            me = this;
        this.app.viewport.modal(mod, {
            researchId: research.id,
            sourceType: research.sourceType || EXAM_SOURCE_TYPE,
            titleType: research.id ? titleType.EDIT : titleType.ADD,
            callback: function(data) {
                var callback = me.renderOptions.callback;
                return me.dispatch('init', {}).then(function() {
                    if (callback) callback(D.assign(data, { isAdd: 1 }));
                });
            }
        });
        return false;
    }
}];

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
