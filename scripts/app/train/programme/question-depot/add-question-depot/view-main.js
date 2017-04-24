exports.type = 'form';

exports.bindings = {
    questionDepot: true,
    state: false
};

exports.components = [function() {
    var questionDepot = this.bindings.questionDepot.data,
        obj = {
            id: 'question-depot',
            name: 'picker',
            options: {
                picker: 'question-depot',
                required: false,
                inputName: 'parentId',
                params: {
                    operatorType: this.app.global.EDIT,
                    organizationId: this.bindings.state.data.organizationId
                },
                data: {}
            }
        };
    if (questionDepot.parentName) {
        obj.options.data.id = questionDepot.parentId;
        obj.options.data.name = questionDepot.parentName;
    }
    return obj;
}, {
    id: 'state',
    name: 'radiox'
}, {
    id: 'auto-to-lower',
    name: 'radiox'
}];
