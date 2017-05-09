exports.items = {
    main: 'main',
    preview: ''
};

exports.store = {
    models: {
        list: { url: '../system/certificate-record/person-list', type: 'pageable', root: 'items' },
        export: { url: '../system/certificate-record/export-person-list' },
        certificate: { url: '../system/certificate-record' },
        down: { url: '../human/file/download' }
    },
    callbacks: {
        init: function() {
            var me = this,
                list = me.models.list;
            list.clear();
            me.get(list);
        },
        viewCertificate: function(data) {
            this.models.certificate.set(data);
            return this.get(this.models.certificate);
        }
    }
};


exports.beforeRender = function() {
    this.dispatch('init');
};
