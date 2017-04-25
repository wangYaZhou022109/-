var _ = require('lodash/collection');
exports.bindings = {
    types: true,
    search: true,
};

exports.actions = {
    'click type-*': 'changeSearch'
};

exports.dataForTemplate = {
    types: function(data) {
        var currentType = data.search.typeId;
        if (!currentType) return data.types;

        _.find(data.types, function(type) {
            return type.id === currentType;
        }).active = true;
        return data.types;
    },
    selectAll: function(data) {
        var currentType = data.search.typeId;
        return !currentType;
    }
};

