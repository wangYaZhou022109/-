exports.bindings = {
    subject: false
};

exports.components = [
    function() {
        var subjectId = this.bindings.subject.data.id;
        var obj = {
            id: 'comment-area',
            name: 'picker',
            options: {
                picker: 'comment-area',
                componentId: 'comment-area',
                businessId: subjectId,
                businessType: 2
            }
        };
        return obj;
    }
];
