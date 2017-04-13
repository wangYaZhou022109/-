exports.bindings = {
    course: true
};

exports.components = [
    function() {
        var courseId = this.bindings.course.data.id,
            title = this.bindings.course.data.name,
            obj = {};
        if (courseId) {
            obj = {
                id: 'comment-area',
                name: 'picker',
                options: {
                    picker: 'comment-area',
                    componentId: 'comment-area',
                    businessId: courseId,
                    businessType: 1,
                    title: title
                }
            };
            return obj;
        }
        return false;
    }
];
