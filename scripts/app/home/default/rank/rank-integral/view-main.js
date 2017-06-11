exports.bindings = {
    integralRank: true
};

exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
    }
};

exports.events = {
    'click more-*': 'more',
    'click detail-*': 'showDetails'
};

exports.handlers = {
    more: function() {
        // this.app.navigate('home/more/rank-topic/' + payload, true);
        var mod = this.module.items['home/default/more/rank/rank-integral'],
            me = this;
        me.app.viewport.modal(mod, { rankModule: this.module.renderOptions.rankModule });
    },
    showDetails: function(payload) {
        window.location.href = '#/ask/topicdetail/' + payload;
        // this.app.show('content', 'ask/mymanage/topicdetail', { id: payload });
    }
};
