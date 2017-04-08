var D = require('drizzlejs');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        research: {}
    },
    callbacks: {
        init: function(payload) {
            this.models.research.set(payload);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions.research);
};

exports.mixin = {
    getData: function() {
        var view = this.items.main;
        return D.assign({}, {
            audienceItems: view.getData() || {}
        });
    },
    isValidator: function() {
        var audience = this.items.main.getData();
        if (!audience || !audience.length) {
            this.app.message.error('请选择受众对象');
            return false;
        }
        return this.items.main.validate();
    }
};
