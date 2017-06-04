var $ = require('jquery'),
    validators = require('./app/ext/views/form/validators');

exports.title = '详情';

exports.bindings = {
    twoBrings: true,
    twoBringsResult: true,
    classId: true,
    signUpInfo: true,
    trainee: true
};

// exports.buttons = [{
//     text: '提交',
//     action: 'commitTwoBrings',
// }];

exports.actions = {
    'click save': 'commitTwoBrings'
};

exports.dataForActions = {
    commitTwoBrings: function() {
        var classId = this.bindings.classId.data.classId;
        var title1 = $(this.$$('[name="title1"]')).val();
        var content1 = $(this.$$('[name="content1"]')).val();
        var title2 = $(this.$$('[name="title2"]')).val();
        var content2 = $(this.$$('[name="content2"]')).val();
        if (!validators.required.fn(title1)) {
            this.app.message.error('标题或内容不能为空');
            return false;
        }
        if (!validators.required.fn(content1)) {
            this.app.message.error('标题或内容不能为空');
            return false;
        }
        if (!validators.required.fn(title2)) {
            this.app.message.error('标题或内容不能为空');
            return false;
        }
        if (!validators.required.fn(content2)) {
            this.app.message.error('标题或内容不能为空');
            return false;
        }
        return {
            classId: classId,
            title1: title1,
            content1: content1,
            title2: title2,
            content2: content2,
        };
    }
};

exports.actionCallbacks = {
    commitTwoBrings: function() {
        this.app.message.success('提交成功！');
        this.module.dispatch('twoBring');
    }
};

exports.dataForTemplate = {
    twoBrings: function(data) {
        var twoBrings = data.twoBrings;
        return twoBrings;
    },
    isGrant: function() {
        var trainee = this.bindings.trainee.data || {};
        if (trainee.id) {
            return true;
        }
        return false;
    }
};
