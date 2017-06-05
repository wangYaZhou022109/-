var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    validators = require('./app/ext/views/form/validators');

exports.bindings = {
    detail: true,
    levels: true,
    state: false,
    nations: true
};

exports.dataForTemplate = {
    levels: function(data) {    // 职级下拉框
        var levelId = data.detail.levelId || '';
        var levels = data.levels;
        _.map(levels, function(level) {
            var l = level;
            if (l.id === levelId) {
                l.selected = true;
            }
        });
        return levels;
    },
    sexs: function(data) {       // 性别下拉框
        var sexs = _.map(maps.get('sexs'), function(t) {
            var sex = t;
            sex.selected = Number(sex.key) === Number(data.detail.sex);
            return sex;
        });
        return sexs;
    },
    nations: function(data) {   // 民族下拉框
        var ethnicityId = data.detail.nation || '',
            nations = data.nations;
        _.map(nations, function(nation) {
            var n = nation;
            if (n.id === ethnicityId) {
                n.selected = true;
            }
        });
        return nations;
    }
};

exports.buttons = [{
    text: '保存',
    action: 'updateFmtrainee'
}];

exports.dataForActions = {
    updateFmtrainee: function(payload) {
        var phoneNumber = payload.phoneNumber;
        var email = payload.email;
        if (!validators.phone.fn(phoneNumber) || phoneNumber === '') {
            this.app.message.error('请输入正确的手机号');
            return false;
        }
        if (!validators.email.fn(email) || email === '') {
            this.app.message.error('请输入正确的邮箱');
            return false;
        }
        return payload;
    }
};

exports.actionCallbacks = {
    updateFmtrainee: function(data) {
        var state = this.bindings.state.data;
        if (data[0]) {
            this.app.message.success('保存成功！');
            this.module.dispatch('init', state);
        } else {
            this.app.message.success('保存失败！');
        }
    }
};
