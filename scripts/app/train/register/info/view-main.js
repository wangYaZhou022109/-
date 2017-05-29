var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');

exports.bindings = {
    classSignupInfo: true,
    member: true,
    nations: true,
    levels: true,
    state: true,
    trainee: true
};

exports.events = {
    'click reSignup': 'reSignup'
};

exports.handlers = {
    reSignup: function() {
        this.bindings.state.data.auditStatus = 3;
        this.bindings.state.changed();
    }
};

exports.actions = {
    'click commit-signup': 'commit'
};

exports.dataForActions = {
    commit: function() {
        var phoneNumber = $(this.$$('[name="phoneNumber"]')).val();
        var email = $(this.$$('[name="email"]')).val();
        var levelId = $(this.$$('[name="levelId"]')).val();
        var sex = $(this.$$('[name="sex"]')).val();
        var nation = $(this.$$('[name="nation"]')).val();
        var remark = $(this.$$('[name="remark"]')).val();
        var settleOrganizationId = $(this.$$('[name="organizationId"]')).val();
        var memberId = $(this.$$('[name="id"]')).val();
        var classId = this.bindings.classSignupInfo.data.classId;
        if (!validators.phone.fn(phoneNumber)) {
            this.app.message.error('手机号输入不正确');
            return false;
        }
        if (!validators.email.fn(email)) {
            this.app.message.error('邮箱输入不正确');
            return false;
        }
        return {
            phoneNumber: phoneNumber,
            email: email,
            levelId: levelId,
            sex: sex,
            nation: nation,
            remark: remark,
            classId: classId,
            settleOrganizationId: settleOrganizationId,
            memberId: memberId
        };
    }
};

exports.actionCallbacks = {
    commit: function(data) {
        var state = this.bindings.state.data;
        var trainee = data[0] || {};
        if (trainee.auditStatus === 0) {
            // 报名成功，跳转审核中页面
            state.auditStatus = 0;
            this.bindings.state.changed();
        } else if (trainee.auditStatus === 1) {
            this.app.message.success('报名成功！');
            // 跳转班级详情页
        } else {
            // 报名失败，跳转审核失败页
            state.auditStatus = 2;
            trainee.auditOpinion = '自动审核，配额已满！';
            this.bindings.trainee.data = trainee;
            this.bindings.state.changed();
            this.bindings.trainee.changed();
        }
    }
};

exports.dataForTemplate = {
    nations: function(data) {   // 民族下拉框
        var ethnicityId = this.bindings.member.data.ethnicityId || '',
            nations = data.nations;
        _.map(nations, function(nation) {
            var n = nation;
            if (n.id === ethnicityId) {
                n.selected = true;
            }
        });
        return nations;
    },
    levels: function(data) {    // 职级下拉框
        var positionLevel = this.bindings.member.data.positionLevel || '';
        var levels = data.levels;
        _.map(levels, function(level) {
            var l = level;
            if (l.id === positionLevel) {
                l.selected = true;
            }
        });
        return levels;
    },
    sexs: function() {          // 性别下拉框
        var me = this,
            sexs = _.map(maps.get('sexs'), function(t) {
                var sex = t;
                sex.selected = Number(sex.key) === Number(me.bindings.member.data.sex);
                return sex;
            });
        return sexs;
    }
};
