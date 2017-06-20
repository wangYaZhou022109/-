var D = require('drizzlejs'),
    validators = require('./app/ext/views/form/validators');

exports.items = {
    main: 'main',
    'center/edit/info': { isModule: true }
};


exports.store = {
    models: {
        member: { url: '../human/member/edit-detail', autoLoad: 'after' },
        memberForm: { url: '../human/member/update-person' },
        menus: { data: [
                { id: '0', name: '基本信息', url: 'info', current: true },
                { id: '1', name: '安全设置', url: 'security' },
        ] },
        state: {
            data: {
                menu: 'info', // 初始菜单
            }
        },
    },
    callbacks: {
        init: function(payload) {
            D.assign(this.models.state.data, {
                callbacks: payload.callback
            });
            this.models.memberForm.clear();
        },
        save: function(options) {
            var memberForm = this.models.memberForm,
                me = this,
                error,
                callbacks;
            D.assign(memberForm.data, options);// 把新值和旧值合并,用新值覆盖旧值
            if (memberForm.data.id) {
                memberForm.data.id = null;
            }
            this.put(memberForm).then(function(data) {
                if (data[0].password === '2') {
                    me.app.message.error('密码修改失败，旧密码输入不正确');
                } else {
                    me.app.message.success('修改成功');
                    callbacks = me.models.state.data.callbacks;
                    callbacks.call();
                }
            }, function(reason) {
                if (reason[0] && reason[0].responseText) {
                    error = JSON.parse(reason[0].responseText);
                    if (error.errorCode === 20116) {
                        me.app.message.error('密码修改失败，旧密码输入不正确');
                    }
                }
            });
            return false;
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init', this.renderOptions);
};

exports.buttons = [
    { text: '保存',
        fn: function(data) {
            var eg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/;
            if (data.summary && data.summary.length > 200) {
                this.app.message.error('个人简介字数不能大于200');
                return false;
            }
            if (data.password) {
                if (!data.oldPassword) {
                    this.app.message.error('请输入旧密码');
                    return false;
                }
                if (!eg.test(data.password)) {
                    this.app.message.error('密码由6-20位数字、字母或符号组合');
                    return false;
                }
                if (data.rePassword !== data.password) {
                    this.app.message.error('确认密码与新密码不一致');
                    return false;
                }
            }
            if (data.newEmail) {
                if (!validators.email.fn(data.newEmail)) {
                    this.app.message.error('邮箱输入不正确');
                    return false;
                }
            }
            return this.dispatch('save', data);
        }
    }
];
