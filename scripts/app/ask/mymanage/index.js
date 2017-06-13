var _ = require('lodash/collection');
// var $ = require('jquery');
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
    'ask/sharedeal': { isModule: true },
    'ask/sharereportaudit': { isModule: true },
    'ask/disscusreportaudit': { isModule: true },
    'ask/mymanage/topicdetail': { isModule: true }
};

exports.store = {
    models: {
        params: { data: { isOverdue: '1' } },
        mymanage: { url: '../system/topic/find-by-manager' },
        todayadd: { url: '../ask-bar/my-manage' },
        // page: {
        //     data: [],
        //     params: { page: 1, size: 2 },
        //     mixin: {
        //         findById: function(id) {
        //             var trends = this.module.store.models.page.data;
        //             return _.find(trends, ['id', id]);
        //         }
        //     }
        // },
        reviewed: { url: '../ask-bar/my-manage/reviewed' },
        display: { url: '../ask-bar/my-manage/reviewed' },
        audit: { url: '../ask-bar/questionReviewed' },
        state: { auditStatus: 1 }
    },
    callbacks: {
        init: function() {
            var mymanage = this.models.mymanage;
            var todayadd = this.models.todayadd;
            var reviewed = this.models.reviewed;
            var me = this;
            // mymanage.set({ id: 1 });
            return me.get(mymanage).then(function(data) {
                var topicList = data[0];
                var params = [];
                _.forEach(topicList, function(d) {
                    params.push(d.id);
                });
                todayadd.set({ id: params.toString() });
                // console.log(params.toString());
                reviewed.set({ id: params.toString(), auditStatus: 1 });
                // console.log(reviewed);
                return me.get(todayadd);
            });
        },
        reviewed: function() {
            var reviewed = this.models.reviewed;
            reviewed.clear();
            reviewed.params = { auditStatus: 1 };
            return this.get(reviewed);
        },
        display: function(payload) {
            var reviewed = this.models.reviewed;
            var state = this.models.state;
            reviewed.clear();
            state.auditStatus = payload.auditStatus;
            reviewed.params = payload;
            return this.get(reviewed);
        }
    }
};
exports.afterRender = function() {
    // this.dispatch('init');
    // this.dispatch('reviewed');
    // var me = this;
    // // console.log(this.renderOptions);
    // $(window).scroll(function() {
    //     var page = me.store.models.page.params.page;
    //     var size = me.store.models.page.params.size;
    //     if (page * size === me.store.models.page.data.length) {
    //         me.store.models.page.params.page++;
    //         me.dispatch('page');
    //     }
    // });
    return this.chain([this.dispatch('init'), this.dispatch('reviewed')]);
};
