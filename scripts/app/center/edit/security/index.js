
exports.items = {
    main: 'main',
};


exports.store = {
    models: {
        member: {},
    }
};

exports.beforeRender = function() {
    this.store.models.member.set(this.renderOptions.member);
};
