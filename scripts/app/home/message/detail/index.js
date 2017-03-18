exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        message: { url: '../system/message' }
    },
    callbacks: {
        init: function(paylaod) {
            var message = this.models.message;
            message.set({ id: paylaod.id });
            return this.get(message);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
