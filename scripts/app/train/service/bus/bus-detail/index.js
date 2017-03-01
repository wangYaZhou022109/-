exports.items = {
    main: 'main',
    search: 'search',
    count: 'count',
};

exports.store = {
    models: {
        busDetail: {
            url: '../train/bus-detail/busDetail',
            type: 'pageable',
            root: 'items'
        },
        export: {
            url: '../train/bus-detail/download'
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
            var busDetail = this.models.busDetail;
            busDetail.params = payload;
            busDetail.set({ id: payload.id });
            return this.get(busDetail);
        },
        search: function(payload) {
            var busDetail = this.models.busDetail,
                id = this.models.state.data.id;
            busDetail.params = payload;
            busDetail.params.id = id;
            return this.get(busDetail);
        },
        refreshList: function(options) {
            var model = this.models.busDetail;
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
