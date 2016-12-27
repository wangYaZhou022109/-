exports.bindings = {
    course: true
};

exports.beforeRender = function() {
    var regions = this.module.regions,
        course = this.bindings.course.data,
        options = { course: course };
    regions.top.show('course/detail/top', options);
    regions.main.show('course/detail/main', options);
    regions.side.show('course/detail/side', options);
};
