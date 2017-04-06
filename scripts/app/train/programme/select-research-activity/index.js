var D = require('drizzlejs');

exports.items = {
    search: 'search',
    content: 'content',
    'train/trainee/select-member-radio': { isModule: true }
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
}];

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};
