var _ = require('lodash/collection'),
    D = require('drizzlejs');

exports.title = '选择试题';

exports.items = {
    'search-param': 'search-param',
    questions: 'questions'
};

exports.buttons = [{
    text: '选择'
}];

exports.store = {
    models: {
        questions: {
            url: '../exam/question',
            root: 'items',
            type: 'pageable',
            mixin: {
                getQuestionById: function(data) {
                    return _.find(this.data, ['id', data]);
                }
            }
        },
        state: { data: {} },
        orgs: { url: '../system/grant/granted-organization', cache: false }
    },
    callbacks: {
        init: function(payload) {
            this.models.questions.clear();
            return this.module.dispatch('searchQuestion', payload);
        },
        searchQuestion: function(payload) {
            this.models.state.data.checkAll = false;
            D.assign(this.models.questions.params, payload, {
                status: 1,
                url: this.module.renderOptions.url
            });
            return this.get(this.models.questions);
        },
        refresh: function() {
            this.models.questions.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', {
        organizationId: this.app.global.currentUser.organization.id,
        name: this.renderOptions.name,
        type: null
    });
};
