exports.items = {
    tab: 'tab',
    main: 'main'
};

exports.store = {
    models: {
        state: { data: {} },
        classQuota: { url: '../train/class-quota' }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            var classQuota = this.models.classQuota;
            classQuota.params = { classId: payload.classId };
            state.data.classId = payload.classId;
            state.data.isAutoApprove = 0;
            state.data.quotaType = 1;
            this.get(classQuota).then(function(data) {
                var ret = data[0];
                if (ret) {
                    state.data.isAutoApprove = ret.isAutoApprove;
                    state.data.quotaType = ret.type;
                    if (ret.isAutoApprove === 1) {
                        state.data.tab = 'fmtrainee';
                        state.data.fmtrainee = true;
                    } else {
                        state.data.tab = 'manage';
                        state.data.manage = true;
                    }
                }
                state.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
