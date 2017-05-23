var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    viewUtil = require('./app/full-text-search/view-util');

exports.items = {
    top: 'top',
    main: 'main'
};

exports.store = {
    models: {
        state: {}
    },
    callbacks: {
        init: function() {
            var historys = _.orderBy(viewUtil.getSearchHistory() || [], ['time'], ['desc']),
                option = historys[0] || {};
            this.models.state.clear();
            this.models.state.set({
                key: viewUtil.typeMaps[option.searchType] || 'all',
                searchContent: option.searchContent,
                topicId: option.topicId,
                topicName: option.topicName
            });
        },
        changeSearchType: function(payload) {
            var state = this.models.state;
            D.assign(state.data, payload);
            state.changed();
        },
        searchByName: function(payload) {
            var state = this.models.state;
            viewUtil.addSearchHistory(payload);
            D.assign(state.data, payload);
            delete state.data.topicId;
            delete state.data.topicName;
            state.changed();
        },
        enterSearch: function(payload) {
            var state = this.models.state;
            viewUtil.addSearchHistory(payload);
            D.assign(state.data, payload);
            delete state.data.topicId;
            delete state.data.topicName;
            state.changed();
        },
        historyName: function(payload) {
            var state = this.models.state;
            viewUtil.editSearchHistory(payload);
            D.assign(state.data, payload);
            delete state.data.topicId;
            delete state.data.topicName;
            state.changed();
        },
        clearHistory: function() {
            viewUtil.clearSearchHistory();
            this.models.state.changed();
        },
        removeHistory: function(payload) {
            viewUtil.removeSearchHistory(payload);
            this.models.state.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
