exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        subject: {
            url: '../course-study/course-info'
        },
        state: {},
        styles: {}
    },
    callbacks: {
        init: function(options) {
            var config = options.config,
                configStr = decodeURIComponent(config),
                subject,
                styles,
                me = this;
            if (configStr) {
                subject = JSON.parse(configStr);
                if (subject.styles) {
                    this.models.subject.set(subject);
                    styles = subject.styles;
                    this.models.styles.set(styles);
                    this.models.state.set({
                        key: styles.code
                    });
                } else if (subject.id) {
                    this.models.subject.set({
                        id: subject.id
                    });
                    this.get(this.models.subject).then(function(data) {
                        if (data[0] && data[0].styles) {
                            styles = JSON.parse(data[0].styles);
                            me.models.styles.set(styles);
                            me.models.state.set({
                                key: styles.code
                            });
                            me.models.state.changed();
                        }
                    });
                }
            }
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
