exports.items = {
    main: 'main',
    company: ''
};

exports.store = {
    models: {
        quotaInfo: { url: '../train/class-quota/info' },
        quotaList: { url: '../train/class-quota/list' },
        quota: { url: '../train/class-quota' },
        delMulti: { url: '../train/class-quota/del-multi' },
        state: { data: {} },
        check: { data: [] }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                quotaInfo = this.models.quotaInfo,
                quotaList = this.models.quotaList,
                me = this;
            state.data.classId = payload.id;
            quotaInfo.params.classId = payload.id;
            this.get(quotaInfo).then(function() {
                quotaList.params.classId = payload.id;
                me.get(quotaList);
            });
        },
        del: function(payload) {
            var quota = this.models.quota,
                quotaList = this.models.quotaList,
                state = this.models.state.data,
                me = this;
            quota.set(payload);
            this.del(quota).then(function() {
                quotaList.params.classId = state.classId;
                me.get(quotaList);
            });
        },
        deleteMulti: function(payload) {
            var quota = this.models.delMulti,
                state = this.models.state.data,
                quotaList = this.models.quotaList,
                me = this;
            quota.set({ ids: payload });
            this.post(quota).then(function() {
                quotaList.params.classId = state.classId;
                me.get(quotaList);
            });
        },
        changeType: function(payload) {
            var quotaInfo = this.models.quotaInfo,
                quota = this.models.quota;
            quotaInfo.data.type = payload.type;
            quota.data = quotaInfo.data;
            this.save(quota).then(function() {
                quotaInfo.changed();
            });
        },
        changeApproval: function(payload) {
            var quotaInfo = this.models.quotaInfo,
                quota = this.models.quota;
            quotaInfo.data.isAutoApprove = payload.isAutoApprove;
            quota.data = quotaInfo.data;
            this.save(quota);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.classId });
};
