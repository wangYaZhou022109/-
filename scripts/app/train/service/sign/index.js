exports.items = {
    main: 'main',
    edit: '',
    preview: '',
    'train/service/sign/sign-detail': { isModule: true }
};

exports.store = {
    models: {
        signs: {
            url: '../train/sign/signs',
            type: 'pageable',
            root: 'items'
        },
        sign: {
            url: '../train/sign'
        },
        batchDelete: {
            url: '../train/sign/batchDelete'
        },
    },
    callbacks: {
        init: function() {
            var signs = this.models.signs;
            return this.get(signs);
        },
        batchDelete: function(payload) {
            var batchDelete = this.models.batchDelete;
            batchDelete.set(payload);
            console.log(payload);
            return this.put(batchDelete);
        },
        search: function(payload) {
            var signs = this.models.signs;
            signs.params = payload;
            return this.get(signs);
        },
        editSign: function(payload) {
            var sign = this.models.sign;
            sign.set(payload);
            return this.get(sign);
        },
        addSign: function(payload) {
            var sign = this.models.sign;
            sign.set(payload);
            return this.save(sign);
        },
        del: function(payload) {
            var sign = this.models.sign;
            sign.set(payload);
            return this.del(sign);
        },
        save: function(payload) {
            var sign = this.models.sign;
            console.log(payload);
            sign.set(payload);
            return this.save(sign);
        },
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { id: this.renderOptions.id });
};
