exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: { data: {} },
        member: { },
        classSignupInfo: { url: '../train/sign-up/detail' },
        trainee: { url: '../train/trainee/find-by-memberId' },
        nations: { url: '../human/member-config/list', autoLoad: 'after', params: { key: 2 } },
        levels: { url: '../human/member-config/list', autoLoad: 'after', params: { key: 8 } },
        traineeSignup: { url: '../train/trainee/sign-up' }
    },
    callbacks: {
        classSignupInfo: function(payload) {
            var classSignupInfo = this.models.classSignupInfo;
            classSignupInfo.clear();
            classSignupInfo.params = { classId: payload.classId };
            return this.get(classSignupInfo);
        },
        trainee: function(payload) {
            var trainee = this.models.trainee;
            trainee.clear();
            trainee.params = {
                classId: payload.classId,
                type: 0,
                memberId: payload.member.id
            };
            return this.get(trainee);
        },
        commit: function(payload) {
            var traineeSignup = this.models.traineeSignup;
            traineeSignup.clear();
            traineeSignup.set(payload);
            return this.save(traineeSignup);
        }
    }
};

exports.beforeRender = function() {
    var state = this.store.models.state.data,
        member = this.store.models.member,
        me = this;
    member.data = me.renderOptions.state.member;
    member.changed();
    me.dispatch('classSignupInfo', me.renderOptions.state);
    me.dispatch('trainee', me.renderOptions.state).then(function(data) {
        var trainee = data[0];
        // 初次报名
        state.auditStatus = 3;
        if (trainee) {
            if (trainee.deleteFlag === 0) {
                if (trainee.auditStatus === 0) {
                    // 审核中
                    state.auditStatus = 0;
                } else if (trainee.auditStatus === 1) {
                    // 跳转班级详情页
                    state.auditStatus = 1;
                } else if (trainee.auditStatus === 2) {
                    // 审核未通过
                    state.auditStatus = 2;
                }
            }
        }
        me.store.models.state.changed();
    });
};
