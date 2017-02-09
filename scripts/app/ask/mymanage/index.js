exports.items = {
    mymanage: 'mymanage'
};

exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        mymanage: { url: '../ask-bar/my-manage' }
    },
    callbacks: {
        init: function() {
            var mymanage = this.models.mymanage;
            mymanage.set({ id: 1 });
            return this.get(mymanage);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init');
};
