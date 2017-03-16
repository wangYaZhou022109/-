var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    list: true,
    img: false
};

exports.actions = {
    'click delete*': 'delete'
};

exports.dataForActions = {
    delete: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '是否确定取消该收藏?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    delete: function() {
        this.app.message.success('取消收藏成功');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list,
            downUrl = this.bindings.img.getFullUrl(),
            defultImg = '';
        _.map(list, function(opt) {
            var obj = opt;
            if (obj.businessType === 1) {
                obj.typeName = '课程';
                defultImg = 'images/default-cover/default_course.jpg';
                obj.url = '#/study/course/detail/' + obj.businessId;
            } else if (obj.businessType === 2) {
                obj.typeName = '专题';
                defultImg = 'images/default-cover/default_spceial.jpg';
                obj.url = '#/study/subject/detail/' + obj.businessId;
            } else if (obj.businessType === 3) {
                obj.typeName = '考试';
                defultImg = 'images/default-cover/default_exam.jpg';
                obj.url = '#/exam/index/' + obj.businessId;
            } else if (obj.businessType === 4) {
                obj.typeName = '班级';
                defultImg = 'images/default-cover/default_class.jpg';
            } else if (obj.businessType === 5) {
                obj.typeName = '直播';
                defultImg = 'images/default-cover/default_live.jpg';
            } else if (obj.businessType === 6) {
                obj.typeName = '调研';
                defultImg = 'images/default-cover/default_survey.jpg';
            } else if (obj.businessType === 7) {
                obj.typeName = '知识';
                defultImg = 'images/default-cover/default_doc.jpg';
                obj.url = 's#/knowledge/details/' + obj.businessId;
            }
            obj.imgUrl = obj.cover ? (downUrl + '?id=' + obj.cover) : defultImg;
            obj.prefixText = '收藏时间：' + helpers.dateMinute(obj.createTime);
        });
        return list;
    }
};
