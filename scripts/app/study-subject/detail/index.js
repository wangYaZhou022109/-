exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        subject: {
            url: '../course-study/course-front'
        },
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
                if (!obj || !obj.id) {
                    me.app.message.error('无法找到该资源!请确认该资源是否存在或已下架!');
                    history.back(-1);
                }
                styles = JSON.parse(obj.styles);
                state.set({
                    key: styles.code
                });
                subject.set(obj);
                me.models.styles.set(styles);
                state.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
