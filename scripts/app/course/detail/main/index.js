exports.items = {
    info: 'info',
    comment: 'comment'
};

exports.store = {
    models: {
        course: { url: '../course-study/course-front' },
        collect: { url: '../system/collect' }
    },
    callbacks: {
        init: function(payload) {
            var course = this.models.course;
            course.set(payload.course);
        },
        collect: function() {
            var courseId = this.models.course.data.id,
                courseName = this.models.course.data.name,
                collect = this.models.collect;
            collect.clear();
            collect.data.businessId = courseId;
            collect.data.businessType = 1;
            collect.data.collectName = courseName;
            return this.save(collect);
        },
        cancelCollect: function(payload) {
            var collect = this.models.collect;
            collect.set(payload);
            return this.del(collect);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
