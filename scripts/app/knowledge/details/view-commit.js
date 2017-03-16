exports.bindings = {
    knowledge: true
};

exports.components = [
    function() {
        var id = this.bindings.knowledge.data.id;
        if (id) {
            return {
                id: 'comment-area',
                name: 'picker',
                options: {
                    picker: 'comment-area',
                    componentId: 'comment-area',
                    businessId: id,
                    businessType: 3
                }
            };
        }
        return false;
    }
];
