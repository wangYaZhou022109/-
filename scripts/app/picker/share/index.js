exports.items = {
    main: 'main',
    bar: 'bar'
};

exports.store = {
    models: {
        shareTemplate: { url: '../system/operation/share/getByCode' },
        share: {}
    },
    callbacks: {
        getTemplate: function(data) {
            var me = this,
                templateCode = data;
            this.models.shareTemplate.clear();
            this.models.shareTemplate.params.code = templateCode;
            return me.get(this.models.shareTemplate);
        }
    }
};

exports.beforeRender = function() {
    this.store.models.share.data = this.renderOptions;
};
