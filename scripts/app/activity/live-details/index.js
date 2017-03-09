exports.items = {
    live: 'live',
    main: 'main',
    side: 'side'
};

exports.store = {
    models: {
        gensee: { url: '../course-study/gensee-student/detail' },
        courses: { url: '../course-study/gensee-student/course' },
        down: { url: '../human/file/download' },
        subGensee: { url: '../course-study/gensee-student/sub' },
        sub: { url: '../course-study/gensee-student/sub-status' },
    },
    callbacks: {
        init: function(params) {
            var gensee = this.models.gensee,
                sub = this.models.sub,
                course = this.models.courses;
            gensee.set(params);
            course.set(params);
            sub.set(params);
            this.get(gensee);
            this.get(course);
            this.get(sub);
        },
        subGensee: function(data) {
            var subGensee = this.models.subGensee,
                me = this;
            subGensee.set(data);
            this.save(subGensee).then(function() {
                me.get(me.models.sub);
                me.app.message.success('操作成功');
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', { id: this.renderOptions.genseeId });
};
