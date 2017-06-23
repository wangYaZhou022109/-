
exports.items = {
    main: 'main'
};
exports.title = function() {
    return this.renderOptions.member.fullName + ' 的履历';
};

exports.store = {
    models: {
        identies: { url: '../human/member/identy', type: 'pageable', root: 'items', pageSize: 5 },
        inners: { url: '../human/member/inner', type: 'pageable', root: 'items', pageSize: 5 }
    },
    callbacks: {
        init: function(payload) {
            this.models.identies.params = { memberId: payload.id };
            this.models.inners.params = { memberId: payload.id };
            this.get(this.models.identies);
            this.get(this.models.inners);
        }
    }
};


exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.member);
};

