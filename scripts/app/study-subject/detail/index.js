exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        subject: {
            url: '../course-study/course-front'
        },
        state: {},
        styles: {}
    },
    callbacks: {
        init: function(options) {
            var subject = this.models.subject,
                state = this.models.state,
                me = this;
            subject.set({
                id: options.id
            });
            return me.get(subject).then(function(data) {
                var obj = data[0],
                    styles = JSON.parse(obj.styles);
                state.set({
                    key: styles.code
                });
                me.models.styles.set(styles);
                state.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
