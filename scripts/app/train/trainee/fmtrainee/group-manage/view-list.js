var _ = require('lodash/collection');

exports.bindings = {
    fmTrainees: true,
    waitTrainees: true,
    state: false
};

exports.events = {
    'click del-trainee*': 'delFm'
};

exports.handlers = {
    delFm: function(id) {
        var waitTrainees = this.bindings.waitTrainees.data;
        var fmTrainees = this.bindings.fmTrainees.data;
        if (!_.find(waitTrainees, ['id', id])) {
            // me.module.dispatch('delFm', id).then(function(data) {
            //     if (data[0]) {
            //         me.module.dispatch('init', state);
            //         me.module.dispatch('wait', state);
            //     }
            // });
        } else {
            fmTrainees = _.filter(fmTrainees, function(fm) {
                return fm.id !== id;
            });
            this.bindings.fmTrainees.data = fmTrainees;
        }
        this.bindings.fmTrainees.changed();
        this.bindings.waitTrainees.changed();
    }
};

exports.actions = {
};
