exports.bindings = {
    topicRank: true
};

exports.events = {
    'click more-*': 'more',
    'click detail-*': 'showDetails'
};

exports.handlers = {
    more: function(id) {
        this.app.navigate('home/more/rank-topic/' + id, true);
        // var mod = this.module.items['activity/index/exam-prompt'],
        //     me = this;
        // me.app.viewport.modal(mod, { name: payload });
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
