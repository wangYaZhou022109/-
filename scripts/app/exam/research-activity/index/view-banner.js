var RESEARCH_TYPE = 5;

exports.bindings = {
    research: true
};

exports.events = {
    'click do-research': 'doResearch'
};

exports.handlers = {
    doResearch: function() {
        var me = this;
        return this.module.dispatch('getRecordByResearch').then(function() {
            me.app.viewport.modal(me.module.items['research-tips']);
        });
    }
};

exports.components = [function() {
    var data = {},
        research = this.bindings.research.data;
    if (research) {
        data.id = research.id;
        data.type = RESEARCH_TYPE;
        data.pics = research.coverId;
        data.title = research.name;
    }
    return {
        id: 'share',
        name: 'picker',
        options: {
            picker: 'share',
            data: data
        }
    };
}];
