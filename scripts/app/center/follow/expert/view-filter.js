var _ = require('lodash/collection');
exports.bindings = {
    search: true,
    topicType: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.topicType) search.topicTypeAll = true;
        return search;
    },
    topicType: function(data) {
        var topicType = data.topicType;
        var search = data.search;
        _.map(topicType, function(opt) {
            var ojb = opt;
            if (search.topicType === ojb.id) {
                ojb.active = true;
            }
        });
        return topicType;
    }
};

exports.events = {
    'click topicType-*': 'topicType',
    'click timeOrder': 'timeOrder',
    'click expert-*': 'details'
};

exports.handlers = {
    topicType: function(topicType) {
        var params = {
            topicType: topicType === 'all' ? '' : topicType
        };
        this.module.dispatch('search', params);
    },
    timeOrder: function() {
        var timeOrder = this.bindings.search.data.timeOrder,
            params = {
                timeOrder: timeOrder === 'asc' ? 'desc' : 'asc'
            };
        this.module.dispatch('search', params);
    }
};
