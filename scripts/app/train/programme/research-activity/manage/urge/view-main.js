var _ = require('lodash/collection'),
    REMOTE_COUNT = 3;

exports.bindings = {
    urge: true,
    researchRecords: true
};

exports.dataForTemplate = {
    members: function() {
        var members = _.map(this.bindings.researchRecords.data, function(r) {
                return r.member.fullName || r.member.name;
            }),
            i = 0,
            result = [];

        for (i; i < REMOTE_COUNT; i++) {
            if (members[i]) result.push(members[i]);
        }

        return {
            nameStr: result.join(',') + '...',
            count: this.bindings.researchRecords.data.length
        };
    }
};
