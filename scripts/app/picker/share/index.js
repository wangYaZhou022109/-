exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        shareTemplate: { url: '../system/operation/share/getByCode' },
        share: {}
    },
    callbacks: {
        init: function() {
            var me = this;
            this.models.shareTemplate.clear();
            return me.get(this.models.shareTemplate);
        }
    }
};

exports.beforeRender = function() {
    this.store.models.share.data = this.renderOptions;
    this.dispatch('init');
};
