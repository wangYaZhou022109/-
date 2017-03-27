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
            url: '../train/sign/batch-delete'
        },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var signs = this.models.signs,
                state = this.models.state;
            signs.clear();
            state.data.classId = payload.classId;
            signs.params = state.data;
            return this.get(signs);
        },
        preview: function(payload) {
            var sign = this.models.sign;
            sign.set(payload);
            return this.get(sign);
        },
        batchDelete: function(payload) {
            var batchDelete = this.models.batchDelete,
                signs = this.models.signs,
                me = this;
            batchDelete.set(payload);
            me.put(batchDelete).then(function() {
                me.app.message.success('删除成功');
                me.get(signs);
            });
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
        del: function(payload) {
            var sign = this.models.sign,
                signs = this.models.signs,
                me = this;
            sign.set(payload);
            this.del(sign).then(function() {
                me.app.message.success('删除成功');
                me.get(signs);
            });
        },
        save: function(payload) {
            var sign = this.models.sign,
                signs = this.models.signs,
                me = this;
            sign.set(payload);
            this.save(sign).then(function() {
                me.app.message.success('保存成功');
                me.get(signs);
            });
        },
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
