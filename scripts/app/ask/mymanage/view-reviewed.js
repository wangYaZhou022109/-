var D = require('drizzlejs');
exports.type = 'dynamic';
exports.bindings = {
    reviewed: true,
    state: true,
    audit: true,
    popupstate: true
};
exports.actions = {
    'click display': 'display'
};
exports.events = {
    'click auditDetails-*': 'auditDetails',
    'click audit-*': 'audit'
};
exports.handlers = {
    audit: function(payload) {
        var data = payload;
        this.app.viewport.modal(this.module.items['ask/quizaudit'], { id: data });
        this.app.viewport.modal(this.module.items['ask/discussaudit'], { id: data });
        this.app.viewport.modal(this.module.items['ask/reportaudit'], { id: data });
        this.app.viewport.modal(this.module.items['ask/shareaudit'], { id: data });
    },
    auditDetails: function(payload) {
        var data = payload;
        this.app.viewport.modal(this.module.items['ask/auditDetails'], { id: data });
        return data;
    },
    popup: function(menu) {
        // console.log('menu :' + menu);
            // var state = this.bindings.popupstate;
            // state.data = {};
            // state.data.menu = menu || 'quizaudit';
            // state.data[menu] = true;
            // state.changed();
        // var region;
        // var el = this.$('popup');
        // region = new D.Region(this.app, this.module, el);
        // region.show('ask/quizaudit', { id: menu });
      // console.log(menu);
        var region;
        var el = this.module.items.popup.$$('.popup')[0];
        region = new D.Region(this.app, this.module, el, 1);
        region.show('ask/quizaudit', { id: menu });
        this.module.items.popup.$$('.shield')[0].hidden = false;
        this.module.items.popup.$$('.catalog-view')[0].hidden = false;
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
exports.actions = {
    'click display': 'display'
};
exports.dataForActions = {
    display: function() {
        var data = {};
        data.auditStatus = 0;
        return data;
    }
};
exports.actionCallbacks = {

};
