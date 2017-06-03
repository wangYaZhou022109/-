exports.items = {
    tab: 'tab',
    main: 'main'
};

exports.store = {
    models: {
        state: { data: { isAutoApprove: 0, quotaType: 1 } },
        classQuota: { url: '../train/class-quota' },
        signUpInfo: { url: '../train/sign-up' }
    },
    callbacks: {
        init: function(payload) {
            var classQuota = this.models.classQuota;
            var signUpInfo = this.models.signUpInfo;
            classQuota.clear();
            signUpInfo.clear();
            classQuota.params = { classId: payload };
            signUpInfo.params = { classId: payload };
            return this.chain(this.get(classQuota), this.get(signUpInfo));
        }
    }
};

exports.beforeRender = function() {
    var me = this,
        state = me.store.models.state.data,
        payload = me.renderOptions.state,
        classId = payload.classId;
    state.classId = payload.classId;
    state.role = payload.role;
    return me.dispatch('init', classId).then(function() {
        var classQuota = me.store.models.classQuota.data || {};
        var signUpInfo = me.store.models.signUpInfo.data || {};
        if (classQuota.id) {
            if (signUpInfo.id) {
                state.isAutoApprove = classQuota.isAutoApprove;
                state.quotaType = classQuota.type;
                state.isOpen = signUpInfo.isOpen;
                // 如果手动审核并且开放报名,显示manage
                if (classQuota.isAutoApprove === 0 && signUpInfo.isOpen === 1) {
                    state.tab = 'manage';
                    state.manage = true;
                // 否则显示学员列表
                } else {
                    state.tab = 'formal-trainee';
                    state.fmtrainee = true;
                }
                me.store.models.state.changed();
            } else {
                me.app.message.alert('当前班级尚未发布通知！');
            }
        } else {
            me.app.message.alert('当前班级尚未配额！');
        }
    });
};
