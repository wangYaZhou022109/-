exports.bindings = {
    state: true,
    questionTypes: true
};

exports.events = {
    'click q-*': 'showQuestion',
    'click list-item-*': 'toggleMore'
};

exports.handlers = {
    toggleMore: function(id) {
        this.module.dispatch('changeState', { typeIndex: Number(id) });
    },
    showQuestion: function(id) {
        return this.module.dispatch('changeState', { questionId: id });
    }
};

exports.dataForTemplate = {
    questionTypes: function() {
        return this.bindings.questionTypes.data;
    }
};
