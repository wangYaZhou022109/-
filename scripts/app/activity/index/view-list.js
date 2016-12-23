exports.bindings = {
    activitys: true,
    params: true
};

exports.events = {
    'click category-item-*': 'toggleItem',
    'click show-paper': 'showPaper'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    showPaper: function() {
    }
};

exports.dataForTemplate = {
    type: function() {
        var params = this.bindings.params.data;
        params.types = {};
        if (!params.type || params.type === 0) {
            params.types.all = true;
        } else if (params.type === 1) {
            params.types.class = true;
        } else if (params.type === 3) {
            params.types.exam = true;
        } else if (params.type === 6) {
            params.types.survey = true;
        } else if (params.type === 2) {
            params.types.live = true;
        }
        return status;
    }
};
