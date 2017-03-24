
exports.items = {
    main: 'main',
};


exports.store = {
    models: {
        member: {}
    },
    callbacks: {
        init: function() {
        },
    }
};

exports.beforeRender = function() {
    this.store.models.member.set(this.renderOptions.member);
};
