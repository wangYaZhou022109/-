exports.bindings = {
    topicRank: true
};

exports.events = {
    'click more-*': 'more',
    'click detail-*': 'showDetails'
};

exports.handlers = {
    more: function() {
        // this.app.navigate('home/more/rank-topic/' + payload, true);
        var mod = this.module.items['home/default/more/rank/rank-topic'],
            me = this;
        me.app.viewport.modal(mod, { data: this.module.renderOptions.rankModule });
    },
    showDetails: function(payload) {
        window.location.href = '#/ask/topicdetail/' + payload;
        // this.app.show('content', 'ask/mymanage/topicdetail', { id: payload });
    }
};

exports.dataForTemplate = {
    rankModule: function(data) {
        var rankModule = data.moduleHomeConfig || {};
        rankModule = this.module.renderOptions.rankModule;
        return rankModule;
    }
};
