exports.items = {
    default: 'default'
};

exports.store = {
    models: {
        course: {},
        register: { url: '../course-study/course-front/register' }
    },
    callbacks: {
        init: function(payload) {
            this.models.course.set(payload.course);
        },
        register: function() {
            var courseId = this.models.course.data.id,
                register = this.models.register;
            register.data = { courseId: courseId };
            return this.save(register).then(function(data) {
                return data;
            }, function() {
                history.back(-1);
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
