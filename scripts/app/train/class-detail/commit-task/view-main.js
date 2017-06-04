var _ = require('lodash/collection');

exports.bindings = {
    tasks: true,
    state: false
};

exports.dataForTemplate = {
    tasks: function() {
        var state = this.bindings.state.data || {},
            tasks = this.bindings.tasks.data;
        _.map(tasks || {}, function(t) {
            var a = t;
            if (state.traineeId) {
                a.isGrant = true;
            } else {
                a.isGrant = false;
            }
            return a;
        });
        return tasks;
    }
};
