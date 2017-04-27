
exports.type = 'dynamic';
exports.bindings = {
    reviewed: true,
    state: true,
    audit: true
    // popupstate: true
};

exports.events = {
    'click audit-*': 'audit',
    'click deal-*': 'deal',
    'click display': 'display'
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
        if (auditType === '5') {
            this.app.viewport.modal(this.module.items['ask/disscusreportaudit'], { id: id });
        }
        if (auditType === '12') {
            this.app.viewport.modal(this.module.items['ask/shareaudit'], { id: id });
        }
        if (auditType === '13') {
            this.app.viewport.modal(this.module.items['ask/sharereportaudit'], { id: id });
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
    },
    display: function(id, e) {
        var status;
        if (e.checked) {
            status = 0;
        } else {
            status = 1;
        }
        this.module.dispatch('display', { auditStatus: status });
    }
};

exports.dataForTemplate = {
    checked: function() {
        var state = this.bindings.state;
        var data = false;
        if (state.auditStatus === 0) {
            data = true;
        }
        return data;
    }
};
