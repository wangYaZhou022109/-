exports.items = {
    main: 'main',
    edit: '',
};

exports.store = {
    models: {
        buss: {
            url: '../train/bus/buss',
            type: 'pageable',
            root: 'items'
        },
        bus: {
            url: '../train/bus'
        },
        publish: {
            url: '../train/bus/publish'
        },
        undo: {
            url: '../train/bus/undo'
        },
    },
    callbacks: {
        init: function() {
            var buss = this.models.buss;
            return this.get(buss);
        },
        publish: function(payload) {
            this.models.publish.set(payload);
            return this.put(this.models.publish);
        },
        undo: function(payload) {
            this.models.undo.set(payload);
            return this.put(this.models.undo);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { id: this.renderOptions.id });
};
