exports.bindings = {
    state: true
};

exports.events = {
    'click collect-*': 'collect',
    'click correct-*': 'correct'
};

exports.handlers = {
    collect: function(id) {
        return this.module.dispatch('collect', { questionId: id });
    },
    correct: function(id) {
        var me = this;
        this.app.viewport.modal(this.module.items.correct, {
            questionId: id,
            callback: function(data) {
                return me.module.dispatch('correct', data);
            }
        });
    }
};
