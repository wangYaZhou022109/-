var D = require('drizzlejs');
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
    'click auditDetails-*': 'auditDetails',
    'click audit-*': 'audit'
};
exports.handlers = {
    audit: function(data, e, target) {
        var id = data,
            auditType = target.getAttribute('auditType');
        console.log(auditType);
        if (auditType === '1') {
            this.app.viewport.modal(this.module.items['ask/quizaudit'], { id: id });
        }
        if (auditType === '2') {
            console.log(222222222222222);
            this.app.viewport.modal(this.module.items['ask/discussaudit'], { id: id });
        }
        if (auditType === '4') {
            console.log(444444444);
            this.app.viewport.modal(this.module.items['ask/reportaudit'], { id: id });
        }
        if (auditType === '12') {
            this.app.viewport.modal(this.module.items['ask/shareaudit'], { id: id });
        }
    },
    auditDetails: function(payload) {
        var data = payload;
        this.app.viewport.modal(this.module.items['ask/auditDetails'], { id: data });
        return data;
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
