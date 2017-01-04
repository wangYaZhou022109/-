exports.bindings = {
    state: true,
    exam: false,
    questionTypes: true
};

exports.events = {
    'click q-*': 'showQuestion',
    'click list-item-*': 'toggleMore'
};

exports.handlers = {
    toggleMore: function(id) {
        this.module.dispatch('changeState', { typeIndex: Number(id) });
        // $(target).find('.min-btn-groups').slideToggle();
        // $(target).siblings().find('.min-btn-groups').slideUp();
    },
    showQuestion: function(id) {
        // e.preventDefault();
        // $(target).addClass('active').siblings().removeClass('active');
        return this.module.dispatch('changeState', { questionId: id });
    }
};

exports.dataForTemplate = {
    questionTypes: function() {
        return this.bindings.questionTypes.data;
    }
};
