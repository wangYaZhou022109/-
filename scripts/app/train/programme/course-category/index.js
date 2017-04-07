var type = {
    courese: '../course-study/course-category'
};

exports.items = {
    main: 'main',
    modal: ''
};

exports.store = {
    models: {
        list: { url: '../course-study/course-category' },
        state: {}
    },

    callbacks: {
        init: function(options) {
            var state = this.models.state.data,
                list = this.models.list;
            state.inputName = options.inputName || 'parentId';
            state.title = options.title;
            state.required = options.required;
            state.parent = options.data;
            if (options.currentCatalogId) {
                list.params.notIncludeCatelogId = options.currentCatalogId;
            }
            if (options.seachType) {
                list.options.url = type[options.seachType];
            }
            list.params.organizationId = options.organizationId || '1';
            return this.get(list);
        },

        selectChanged: function(payload) {
            var state = this.models.state;
            state.data.parent = payload;
            state.changed();
        }
    }
};

exports.beforeRender = function() {
    var options = this.renderOptions;

    this.dispatch('init', options);
};

exports.mixin = {
    validate: function() {
        return this.items.main.validate();
    }
};
