exports.items = {
    banner: 'banner',
    side: 'side',
    main: 'main'
};

exports.store = {
    models: {
        state: { data: {} },
        classSignupInfo: { url: '../train/sign-up/detail' },
        member: { url: '../train/member' },
        trainee: { url: '../train/trainee/current-trainee' },
        down: { url: '../human/file/download' },
        nations: { url: '../human/member-config/list', autoLoad: 'after', params: { key: 2 } },
        levels: { url: '../human/member-config/list', autoLoad: 'after', params: { key: 8 } },
        traineeSignup: { url: '../train/trainee/sign-up' },
        downloadDoc: { url: '../train/sign-up/download-doc' }
    },
    callbacks: {
        classSignupInfo: function(payload) {
            var classSignupInfo = this.models.classSignupInfo;
            var state = this.models.state.data;
            state.classId = payload.classId;
            classSignupInfo.clear();
            classSignupInfo.params = payload;
            return this.get(classSignupInfo);
        },
        member: function() {
            var member = this.models.member;
            return this.get(member);
        },
        trainee: function(payload) {
            var trainee = this.models.trainee;
            trainee.clear();
            trainee.params = {
                classId: payload.classId,
                type: 0
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
    // var state = this.store.models.state.data,
    //     me = this,
    //     payload = this.renderOptions.classId,
    //     index,
    //     classId;
    // index = Number(payload.indexOf('?'));
    // if (index !== -1) {
    //     classId = payload.split('?')[0].trim();
    //     state.activity = true;
    // } else {
    //     classId = payload;
    // }
    // me.dispatch('classSignupInfo', { classId: classId });
    // me.dispatch('member');
    // me.dispatch('trainee', { classId: classId }).then(function(data) {
    //     var trainee = data[0];
    //     // 初次报名
    //     state.auditStatus = 3;
    //     if (trainee) {
    //         if (trainee.deleteFlag === 0) {
    //             if (trainee.auditStatus === 0) {
    //                 // 审核中
    //                 state.auditStatus = 0;
    //             } else if (trainee.auditStatus === 1) {
    //                 // 学员已报名成功
    //                 state.auditStatus = 1;
    //             } else if (trainee.auditStatus === 2) {
    //                 // 审核未通过
    //                 state.auditStatus = 2;
    //             }
    //         }
    //     }
    //     me.store.models.state.changed();
    // });
    var state = this.store.models.state.data,
        me = this;
    me.dispatch('classSignupInfo', me.renderOptions);
    me.dispatch('member');
    me.dispatch('trainee', me.renderOptions).then(function(data) {
        var trainee = data[0];
        // 初次报名
        state.auditStatus = 3;
        if (trainee) {
            if (trainee.deleteFlag === 0) {
                if (trainee.auditStatus === 0) {
                    // 审核中
                    state.auditStatus = 0;
                } else if (trainee.auditStatus === 1) {
                    // 学员已报名成功
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
