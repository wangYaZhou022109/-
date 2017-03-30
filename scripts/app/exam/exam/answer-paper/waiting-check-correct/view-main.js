exports.bindings = {
    state: true
};

exports.events = {
    'click waiting-check-*': 'waitingCheck',
    'click correct-*': 'correct'
};

exports.handlers = {
    waitingCheck: function(id) {
        this.$('check').classList.add('checked');
        return this.module.dispatch('waitingCheck', { questionId: id });
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
