exports.bindings = {
    studyRank: true
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
    'click details-*': 'detail'
};

exports.handlers = {
    more: function() {
        // this.app.navigate('home/more/rank-topic/' + payload, true);
        var mod = this.module.items['home/default/more/rank/rank-finish-course'],
            me = this;
        me.app.viewport.modal(mod, { rankModule: this.module.renderOptions.rankModule });
    },
    detail: function(id) {
        window.location.href = '#/knowledge/detail/' + id;
    }
};
