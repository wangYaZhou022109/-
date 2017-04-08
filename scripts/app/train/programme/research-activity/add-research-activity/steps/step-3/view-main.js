var _ = require('lodash/collection'),
    typeMap = { 1: 'org1', 2: 'org2', 3: 'job', 4: 'post', 5: 'member', 6: 'tag' },
    typeMapInvert = (function(maps) {
        var ret = {};
        _.each(maps, function(v, k) {
            ret[v] = k;
        });
        return ret;
    }(typeMap));

exports.type = 'form';

exports.bindings = {
    research: true
};

exports.components = [
    function() {
        var audiences = this.bindings.research.data.audienceItems || [];
        audiences = _.map(audiences, function(item) {
            return {
                id: item.joinId,
                type: typeMap[item.joinType],
                value: item.joinName
            };
        });

        return {
            id: 'audience-object',
            name: 'picker',
            options: {
                picker: 'audience-new',
                required: true,
                audiences: audiences
            }
        };
    },
    {
        id: 'push-personal-center',
        name: 'selectize'
    }
];

exports.mixin = {
    getData: function() {
        return _.map(this.components['audience-object'].getData() || [], function(item) {
            var r = {};
            r.joinId = item.id;
            r.joinType = typeMapInvert[item.type];
            r.joinName = item.value;
            return r;
        });
    }
};
