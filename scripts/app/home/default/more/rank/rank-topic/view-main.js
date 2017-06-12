
exports.bindings = {
    topicRank: true
};

exports.events = {
    'click rankClose': 'rankClose',
    'click detail-*': 'showDetails'
};

exports.handlers = {
    rankClose: function() {
        this.app.viewport.closeModal();
        window.location.href = '#/ask/topic/index';
    },
    showDetails: function(payload) {
        this.app.viewport.closeModal();
        window.location.href = '#/ask/topicdetail/' + payload;
    }
};

exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
    }
};
