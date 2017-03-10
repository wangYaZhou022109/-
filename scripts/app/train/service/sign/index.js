exports.items = {
    main: 'main',
    edit: '',
    preview: '',
    'train/service/sign/sign-detail': { isModule: true },
    'train/service/sign/sign-leave': { isModule: true }
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
        state: { data: { classId: 3 } }
    },
    callbacks: {
        preview: function(payload) {
            var sign = this.models.sign;
            sign.set(payload);
            return this.get(sign);
        },
        init: function(payload) {
            var signs = this.models.signs;
            signs.params = payload;
            return this.get(signs);
        },
        batchDelete: function(payload) {
            var batchDelete = this.models.batchDelete;
            batchDelete.set(payload);
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
            sign.set(payload);
            return this.save(sign);
        },
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    this.dispatch('init', classId);
};
