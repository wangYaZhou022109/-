exports.bindings = {
    state: true
};

exports.events = {
    'click notice': 'notice'
};

exports.handlers = {
    notice: function() {
        var me = this;
        return this.module.dispatch('notice').then(function() {
            me.app.viewport.modal(me.module.items['exam-notes']);
        });
    }
};

exports.dataForTemplate = {
    showExamNotes: function(data) {
        return data.state.examNotes;
    }
};
