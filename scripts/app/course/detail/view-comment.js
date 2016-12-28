exports.bindings = {
    course: true
};

exports.components = [
    function() {
        var courseId = this.bindings.course.data.id,
            obj = {};
        if (courseId) {
            obj = {
                id: 'comment-area',
                name: 'picker',
                options: {
                    picker: 'comment-area',
                    componentId: 'comment-area',
                    businessId: courseId,
                    businessType: 1
                }
            };
            return obj;
        }
        return false;
    }
];
