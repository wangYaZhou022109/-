exports.events = {
    'click mostsign-*': 'showMostsign'
};

exports.handlers = {
    showMostsign: function() {
        var model = this.module.items['center/managements/attendancelist/mostsign'];
        this.app.viewport.modal(model);
    }
};
