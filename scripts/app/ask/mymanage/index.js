exports.items = {
    mymanage: 'mymanage',
    reviewed: 'reviewed',
    'ask/quizaudit': { isModule: true },
    'ask/discussaudit': { isModule: true },
    'ask/reportaudit': { isModule: true },
    'ask/shareaudit': { isModule: true },
    'ask/quizdeal': { isModule: true },
    'ask/discussdeal': { isModule: true },
    'ask/reportdeal': { isModule: true },
    'ask/sharedeal': { isModule: true }
};

exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        mymanage: { url: '../ask-bar/my-manage' },
        reviewed: { url: '../ask-bar/my-manage/reviewed' },
        display: { url: '../ask-bar/my-manage/reviewed' },
        audit: { url: '../ask-bar/questionReviewed' },
        state: { auditStatus: 1 }
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
        },
        display: function(payload) {
            var params = payload;
            var reviewed = this.models.reviewed;
            reviewed.set({ id: 1 });
            reviewed.params = params;
            return this.get(reviewed);
        }
    }
};
exports.afterRender = function() {
    this.dispatch('init');
    this.dispatch('reviewed');
};