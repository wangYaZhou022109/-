exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: { data: {} },
        member: { url: '../train/member/find-by-phone' },
        classSignupInfo: { url: '../train/sign-up/find-by-code' }
    },
    callbacks: {
        getMember: function(payload) {
            var member = this.models.member;
            member.clear();
            member.params = payload;
            return this.get(member);
        },
        getClassSignupInfo: function(payload) {
            var classSignupInfo = this.models.classSignupInfo;
            classSignupInfo.clear();
            classSignupInfo.params = payload;
            return this.get(classSignupInfo);
        }
    }
};
