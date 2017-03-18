exports.bindings = {
    researchRecords: true,
    search: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'researchRecords' }
}];

exports.actions = {
    'click search': 'search'
};

exports.events = {
    'click do-research-*': 'showResearchPaper',
    'click item-*': 'search',
    'click view-detail-*': 'showResearchAnswerDetail'
};

exports.handlers = {
    showResearchPaper: function(id) {
        var mod = this.module.items['research-tips'],
            me = this;
        return this.module.dispatch('getResearchById', { id: id }).then(function(data) {
            me.app.viewport.modal(mod, { research: data });
        });
    },
    search: function(status) {
        return this.module.dispatch('search', {
            status: status,
            name: this.$('name').value
        });
    },
    showResearchAnswerDetail: function(id) {
        var url = '#/exam/research-activity/research-answer-detail/' + id;
        window.open(url, '_blank');
    }
};

