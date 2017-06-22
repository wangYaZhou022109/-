// var $ = require('jquery');
exports.bindings = {
    titledata: true
};

exports.events = {
    'click select-srop-*': 'title'
};

exports.handlers = {
    title: function() {
        // var title = this.bindings.titledata.getData(payload);
        // $(this.$('selectdrop')).parent().prev().find('input')[0].value = title;
        // $(this.$('selectdrop')).parent().parent().css('overflow', 'hidden');
        this.app.viewport.closeModal();
    }
};
