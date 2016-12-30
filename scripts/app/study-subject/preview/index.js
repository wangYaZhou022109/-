exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        subject: {},
        state: {},
        styles: {}
    },
    callbacks: {
        init: function(options) {
            var config = options.config,
                subject = decodeURIComponent(config);
            if (subject) {
                subject = JSON.parse(subject);
                this.models.subject.set(subject);
                this.models.styles.set(subject.styles);
                this.models.state.set({
                    key: subject.styles.code
                });
            }
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
