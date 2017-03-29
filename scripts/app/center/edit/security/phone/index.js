
exports.items = {
    main: 'main',
};


exports.store = {
    models: {
        member: {},
        phoneList: { url: '../human/member-phone' },
        phone: { url: '../human/member-phone' },
        memberForm: { url: '../human/member/update-person' }
    },
    callbacks: {
        init: function() {
            var phoneList = this.models.phoneList;
            return this.get(phoneList);
        },
        savePhone: function(payload) {
            var phone = this.models.phone,
                phoneList = this.models.phoneList,
                me = this;
            phone.set(payload);
            this.put(phone).then(function() {
                this.app.message.success('添加成功');
                return me.get(phoneList);
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
            return this.put(memberForm).then(function(data) {
                me.models.member.data.phoneNumber = data[0].phoneNumber;
            });
        }
    }
};

exports.beforeRender = function() {
    this.store.models.member.set(this.renderOptions.member);
    this.dispatch('init');
};
