exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        subject: {},
        register: {
            url: '../course-study/course-front/register'
        },
        state: {},
        styles: {}
    },
    callbacks: {
        init: function(options) {
            var subject = this.models.subject,
                state = this.models.state,
                register = this.models.register,
                me = this;
            register.set({
                courseId: options.id
            });
            return me.post(register).then(function(data) {
                var obj = data[0],
                    styles;
                if (obj.styles) {
                    styles = JSON.parse(obj.styles);
                    state.set({
                        key: styles.code
                    });
                }
                subject.set(obj);
                me.models.styles.set(styles);
                state.changed();
            }, function() {
                history.back(-1);
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
