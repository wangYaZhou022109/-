exports.bindings = {
    state: true
};

exports.events = {
    'mouseover notice': 'notice'
    // 'mouseout leave-notice': 'closeNotice'
};

exports.handlers = {
    notice: function() {
        var me = this;
        return this.module.dispatch('notice').then(function() {
            me.app.viewport.modal(me.module.items['exam-notes']);
        });
    }
    // closeNotice: function() {
    //     if (this.bindings.state.data.noticed) {
    //         this.app.viewport.closeModal();
    //         this.bindings.state.data.noticed = false;
    //     }
    // }
};

exports.dataForTemplate = {
    showExamNotes: function(data) {
        return data.state.examNotes;
    }
};
