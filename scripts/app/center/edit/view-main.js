var _ = require('lodash/collection'),
    $ = require('jquery');

exports.type = 'dynamic';

exports.bindings = {
    state: true,
    member: true,
    menus: true,
    memberForm: false
};

exports.getEntity = function() {
    return {
        member: this.bindings.member.data
    };
};

// 这个data获取的是getEntity返回的值，会作为renderOptions传入给要渲染的Module
exports.dataForEntityModule = function(data) {
    return data;
};

// 这里的data获取的是 view 里面 data-dynamic-key 的值
exports.getEntityModuleName = function(key) {
    var url = this.bindings.state.data.menu;
    if (typeof key === 'string' && key !== '') {
        url = key;
    }
    return 'center/edit/' + url;
};

exports.events = {
    'click switch-*': 'switchMenu'
};

exports.handlers = {
    switchMenu: function(menuId) {
        var state = this.bindings.state,
            menus = this.bindings.menus.data,
            menu = '',
            member = this.bindings.member.data,
            memberForm = this.bindings.memberForm.data;
        var summary = $(this.$$('[name="summary"]')).val();
        var headPortrait = $(this.$$('[name="headPortrait"]')).val();
        var sex = $(this.$$('[name="sex"]:checked')).val();
        var oldPassword = $(this.$$('[name="oldPassword"]')).val();
        var password = $(this.$$('[name="password"]')).val();
        var rePassword = $(this.$$('[name="rePassword"]')).val();
        var newEmail = $(this.$$('[name="newEmail"]')).val();
        var eg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/;
        var emg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        _.forEach(menus, function(m) {
            var obj = m;
            if (obj.id === menuId) {
                obj.current = true;
            } else {
                obj.current = false;
            }
        });
        if (menuId === '1') {
            if (summary) {
                summary = $.trim(summary);
                if (summary.length > 200) {
                    this.app.message.error('个人简介字数不能大于200');
                    return false;
                }
            }
            if (headPortrait) {
                member.memberDetail.headPortrait = headPortrait;
                memberForm.headPortrait = headPortrait;
            }
            member.memberDetail.summary = summary;
            member.sex = sex;
            memberForm.summary = summary;
            memberForm.sex = sex;
        } else if (menuId === '0') {
            if (password) {
                if (!oldPassword) {
                    this.app.message.error('请输入旧密码');
                    return false;
                }
                if (!eg.test(password)) {
                    this.app.message.error('密码由6-20位数字、字母或符号组合');
                    return false;
                }
                if (rePassword !== password) {
                    this.app.message.error('确认密码与新密码不一致');
                    return false;
                }
            }
            if (newEmail) {
                if (!emg.test(newEmail)) {
                    this.app.message.error('邮箱输入不正确');
                    return false;
                }
            }
            member.oldPassword = oldPassword;
            member.password = password;
            member.rePassword = rePassword;
            member.newEmail = newEmail;
            memberForm.oldPassword = oldPassword;
            memberForm.password = password;
            memberForm.rePassword = rePassword;
            memberForm.newEmail = newEmail;
        }
        this.bindings.member.changed();
        menu = this.bindings.menus.data[menuId].url;
        state.data = {};
        state.data.menu = menu;
        state.data.menuId = menuId;
        state.data[menu] = true;
        state.changed();
        return true;
    }
};
