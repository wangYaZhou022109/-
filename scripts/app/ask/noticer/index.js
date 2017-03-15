exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        member: { url: '../ask-bar/concern/followMe' }
    },
    callbacks: {
        init: function() {
            var member = this.models.member;
            member.set({ id: 'me' });
            return this.get(member);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
