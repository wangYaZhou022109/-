
exports.type = 'dynamic';
exports.bindings = {
    reviewed: true,
    state: true,
    audit: true,
    //popupstate: true
};
exports.actions = {
    'click display': 'display'
};
exports.events = {
    'click audit-*': 'audit',
    'click deal-*': 'deal'
};
exports.handlers = {
    audit: function(data, e, target) {
        var id = data,
            auditType = target.getAttribute('auditType');
        if (auditType === '1') {
            this.app.viewport.modal(this.module.items['ask/quizaudit'], { id: id });
        }
        if (auditType === '2') {
            this.app.viewport.modal(this.module.items['ask/discussaudit'], { id: id });
        }
        if (auditType === '4') {
            this.app.viewport.modal(this.module.items['ask/reportaudit'], { id: id });
        }
        if (auditType === '12') {
            this.app.viewport.modal(this.module.items['ask/shareaudit'], { id: id });
        }
    },
    deal: function(data, e, target) {
        var id = data,
            auditType = target.getAttribute('auditType');
        if (auditType === '1') {
            this.app.viewport.modal(this.module.items['ask/quizdeal'], { id: id });
        }
        if (auditType === '2') {
            this.app.viewport.modal(this.module.items['ask/discussdeal'], { id: id });
        }
        if (auditType === '4') {
            this.app.viewport.modal(this.module.items['ask/reportdeal'], { id: id });
        }
        if (auditType === '12') {
            this.app.viewport.modal(this.module.items['ask/sharedeal'], { id: id });
        }
    }
};

exports.dataForActions = {
    display: function() {
        var status = this.bindings.state.data,
            data = {};
        if (status === 0) {
            data.auditStatus = 0;
            status = 1;
        } else {
            status = 0;
        }
        this.bindings.state.data.status = status;
        return data;
    }
};
exports.actionCallbacks = {

};
exports.dataForActions = {
    display: function() {
        var data = {};
        data.auditStatus = 0;
        return data;
    }
};
