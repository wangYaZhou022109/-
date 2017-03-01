exports.items = {
    main: 'main',
    search: 'search',
    count: 'count',
};

exports.store = {
    models: {
        signDetail: {
            url: '../train/sign-detail/signDetail',
            type: 'pageable',
            root: 'items'
        },
        export: {
            url: '../train/sign-detail/download'
        },
        state: { data: {} },
    },
    callbacks: {
        export: function() {
            var params = this.models.search.getQueryParams();
            params.page = 1;
            params.pageSize = 100000;
            this.models.export.params = params;
            this.get(this.models.export);
        },
        init: function(payload) {
            var signDetail = this.models.signDetail;
            signDetail.params = payload;
            signDetail.set({ id: payload.id });
            return this.get(signDetail);
        },
        search: function(payload) {
            var signDetail = this.models.signDetail,
                id = this.models.state.data.id;
            signDetail.params = payload;
            signDetail.params.id = id;
            return this.get(signDetail);
        },
        refreshList: function(options) {
            var model = this.models.signDetail;
            model.clear();
            model.params = options;
            this.get(model);
        }
    }
};

exports.beforeRender = function() {
    var data = this.store.models.state.data;
    data.id = this.renderOptions.id;
    this.dispatch('init', { id: this.renderOptions.id });
};
