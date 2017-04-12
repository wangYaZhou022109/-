
exports.items = {
    main: 'main',
};


exports.store = {
    models: {
        member: {},
        phoneList: { url: '../human/member-phone' },
        phone: { url: '../human/member-phone' },
        memberForm: { url: '../human/member/update-person' },
        findMember: { url: '../human/member/find-phone-exist' }
    },
    callbacks: {
        init: function() {
            var phoneList = this.models.phoneList;
            return this.get(phoneList);
        },
        savePhone: function(payload) {
            var phone = this.models.phone,
                phoneList = this.models.phoneList,
                findMember = this.models.findMember,
                me = this;
            phone.set(payload);
            // 验证手要号是否已存在
            findMember.params = { phone: payload.phone };
            me.get(findMember).then(function(data) {
                if (data[0] > 0) {
                    me.app.message.error('该手机号已存在');
                    return;
                }
                me.put(phone).then(function() {
                    me.app.message.success('添加成功');
                    return me.get(phoneList);
                });
            });
        },
        deletePhone: function(payload) {
            var phone = this.models.phone,
                me = this;
            phone.set(payload);
            return me.del(phone).then(function() {
                return me.get(me.models.phoneList);
            });
        },
        setMain: function(payload) {
            var memberForm = this.models.memberForm,
                me = this;
            memberForm.set(payload);
            return me.put(memberForm).then(function(data) {
                me.models.member.data.phoneNumber = data[0].phoneNumber;
            });
        }
    }
};

exports.beforeRender = function() {
    this.store.models.member.set(this.renderOptions.member);
    this.dispatch('init');
};
