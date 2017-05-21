var maps = require('./app/util/maps'),
    $ = require('jquery'),
    _ = require('lodash/collection'),
    D = require('drizzleJs'),
    viewUtil = require('./app/full-text-search/view-util');

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    searchTypes: function() {
        var searchTypes = maps.get('search-type'),
            state = this.bindings.state.data;
        _.map(searchTypes, function(data) {
            var type = data;
            if (viewUtil.typeMaps[type.key] === state.key) {
                type.selected = true;
            }
            return type;
        });
        return searchTypes;
    },
    searchHistorys: function() {
        var searchHistorys = viewUtil.getSearchHistory();
        return _.orderBy(
            _.filter(searchHistorys || [], function(o) { return o.searchContent; }) || [],
            ['time'], ['desc']).slice(0, 6);
    }
};


exports.events = {
    'click searchType-*': 'changeSearchType',
    'click searchContent': 'showSearchMore',
    'mouseover searchMore': 'showSearchMore',
    'mouseout searchMore': 'hideSearchMore'
};

exports.actions = {
    'click searchBtn': 'searchByName',
    'click clearHistory': 'clearHistory',
    'keypress searchContent': 'enterSearch',
    'click historyName-*': 'historyName',
    'click topic-*': 'searchByTopic'
};

exports.handlers = {
    changeSearchType: function(index, e, obj) {
        $(obj).addClass('active').siblings().removeClass('active');
        this.module.dispatch('changeSearchType', { key: viewUtil.typeMaps[index] });
    },
    showSearchMore: function() {
        $(this.$('searchMore')).addClass('show');
    },
    hideSearchMore: function() {
        $(this.$('searchMore')).removeClass('show');
    }
};

exports.dataForActions = {
    searchByName: function(payload) {
        var params = payload,
            time = new Date().getTime();
        params.id = D.uniqueId('search') + time;
        params.time = time;
        return params.searchContent ? params : false;
    },
    enterSearch: function(payload, e) {
        var params = payload,
            time = new Date().getTime();
        if (e.keyCode === 13 && params.searchContent) {
            params.id = D.uniqueId('search') + time;
            params.time = time;
            $(this.$('searchPannel')).hide();
            return params;
        }
        return false;
    },
    historyName: function(payload) {
        return { id: payload.id };
    }
};
