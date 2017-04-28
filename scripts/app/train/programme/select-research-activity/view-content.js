var $ = require('jquery'),
    D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.bindings = {
    researchActivities: true,
    research: false
};

exports.dataForTemplate = {
    researchActivities: function(data) {
        var me = this;
        return _.map(data.researchActivities, function(r) {
            var researchId = me.bindings.research.data.id;
            if (researchId && researchId === r.id) {
                return D.assign(r, { checked: true });
            }
            return r;
        });
    }
};

exports.components = [
    { id: 'pager', name: 'background-pager', options: { model: 'researchActivities' } }
];

exports.mixin = {
    getData: function() {
        return _.find(this.bindings.researchActivities.data, [
            'id', $(this.$$('[name="select-research"]:checked')).val()
        ]);
    }
};

exports.events = {
    'click preview-*': 'previewResearch'
};

exports.handlers = {
    previewResearch: function(id) {
        var mod = this.module.items['train/programme/research-activity/preview-questionary'];
        this.app.viewport.modal(mod, {
            researchId: id,
            callback: function() {
            }
        });
    }
};
