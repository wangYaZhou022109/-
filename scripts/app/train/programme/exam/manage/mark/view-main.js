exports.events = {
    'click save': 'saveMarkConfigs'
};

exports.handlers = {
    saveMarkConfigs: function() {
        return this.module.dispatch('save');
    }
};
