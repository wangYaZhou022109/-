exports.afterRender = function() {
    var options = { courseId: this.renderOptions.id };
    this.regions.top.show('course/detail/top', options);
    this.regions.main.show('course/detail/main', options);
    this.regions.side.show('course/detail/side', options);
};
