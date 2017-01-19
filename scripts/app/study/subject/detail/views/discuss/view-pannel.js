exports.bindings = {
    region: false,
    subject: false,
    state: false
};

exports.components = [
    function() {
        var subjectId = this.bindings.subject.data.id,
            state = this.bindings.state.data || {},
            available = true;
        if (state.type === 'preview') {
            available = false;
        }
        return {
            id: 'comment-area',
            name: 'picker',
            options: {
                picker: 'comment-area',
                componentId: 'comment-area',
                businessId: subjectId,
                businessType: 2,
                available: available
            }
        };
    }
];
