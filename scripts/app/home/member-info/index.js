exports.items = {
    main: 'main',
    'home/member-tag': { isModule: true }
};

exports.title = '您好';

exports.buttons = [{
    text: '确定',
    fn: function(payload) {
        var me = this;
        if (payload.phoneNumber === '') {
            this.app.message.error('电话号码不能为空！');
            return false;
        }
        if (payload.email === '') {
            this.app.message.error('邮箱不能为空！');
            return false;
        }
        this.dispatch('save', payload).then(function() {
            me.app.viewport.closePopup().then(function() {
                me.app.viewport.modal(me.items['home/member-tag']);
            });
        });
        return false;
    }
}];
exports.store = {
    models: {
        member: { url: '../human/member/edit-detail', autoLoad: 'after' },
        memberForm: { url: '../human/member/update-person' }
    },
    callbacks: {
        save: function(payload) {
            var memberForm = this.models.memberForm;
            memberForm.set(payload);
            return this.put(memberForm);
        }
    }
};
