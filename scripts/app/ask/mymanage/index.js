exports.items = {
    mymanage: 'mymanage',
    reviewed: 'reviewed'
};

exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        mymanage: { url: '../ask-bar/my-manage' },
        reviewed: { url: '../ask-bar/my-manage/reviewed' }
    },
    callbacks: {
        init: function() {
            var mymanage = this.models.mymanage;
            mymanage.set({ id: 1 });
            return this.get(mymanage);
        },
        reviewed: function() {
            var reviewed = this.models.reviewed;
            reviewed.set({ id: 1 });
            return this.get(reviewed);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init');
    this.dispatch('reviewed');
};
