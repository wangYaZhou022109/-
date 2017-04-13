
exports.title = '查看课件';
exports.items = {
    main: 'main'
};
exports.store = {
    models: {
        attachList: { url: '../train/offline-course/findAttach' },
        download: { url: '../human/file/download' }
    },
    callbacks: {
        init: function(payload) {
            var attachList = this.models.attachList;
            attachList.params.id = payload;
            return this.get(attachList);
        }
    }
};
exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.id);
};
