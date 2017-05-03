exports.bindings = {
    classInfo: true
};

exports.components = [
    function() {
        var classId = this.bindings.classInfo.data.id,
            title = this.bindings.classInfo.data.className,
            obj = {};
        if (classId) {
            obj = {
                id: 'comment-area',
                name: 'picker',
                options: {
                    picker: 'comment-area',
                    componentId: 'comment-area',
                    businessId: classId,
                    businessType: 4,
                    title: title
                }
            };
            return obj;
        }
        return false;
    }
];
