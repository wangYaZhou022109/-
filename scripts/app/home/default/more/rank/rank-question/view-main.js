exports.bindings = {
    rank: true
};
exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
    }
};

exports.events = {
    'click details-*': 'detail',
    'click rankClose': 'rankClose'
};

exports.handlers = {
    detail: function(id) {
        this.app.viewport.closeModal();
        window.location.href = '#/ask/questiondetails/' + id;
    },
    rankClose: function() {
        this.app.viewport.closeModal();
        window.location.href = '#/ask/index';
    }
};
