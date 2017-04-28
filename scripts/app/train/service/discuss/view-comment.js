exports.bindings = {
    state: true
};

exports.components = [
    function() {
        var courseId = this.bindings.state.data.id,
            obj = {};
        if (courseId) {
            obj = {
                id: 'comment-area',
                name: 'picker',
                options: {
                    picker: 'comment-area',
                    componentId: 'comment-area',
                    businessId: courseId,
                    businessType: 3
                }
            };
            return obj;
        }
        return false;
    }
];
