
exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        signupInfo: { url: '../train/sign-up' },
        download: { url: '../train/notice/download' },
        export: { url: '../train/sign-up/export' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                signupInfo = this.models.signupInfo;
            state.data.classId = payload.id;
            signupInfo.params.classId = payload.id;
            this.get(signupInfo);
        },
        save: function(payload) {
            var state = this.models.state.data,
                signupInfo = this.models.signupInfo,
                me = this;
            signupInfo.set(payload);
            signupInfo.data.classId = state.classId;
            this.save(signupInfo).then(function() {
                me.app.message.success('保存成功');
                signupInfo.clear();
                me.get(signupInfo);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.state.classId });
};
