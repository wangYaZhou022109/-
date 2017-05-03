var $ = require('jquery');
var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    progressList: true,
    img: false,
    search: false
};
exports.events = {
    'mouseover list-*': 'showClose',
    'mouseout list-*': 'hideClose'
};

exports.handlers = {
    showClose: function(id) {
        $(this.$('delete-' + id)).addClass('fade-in').removeClass('fade-out');
    },
    hideClose: function(id) {
        $(this.$('delete-' + id)).addClass('fade-out').removeClass('fade-in');
    }
};


exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'progressList' }
}];

exports.dataForTemplate = {
    progressList: function(data) {
        var progressList = data.progressList,
            search = data.search,
            downUrl = this.bindings.img.getFullUrl(),
            defultImg = 'images/default-cover/default_course.jpg',
            prefix = { 0: '推送学习时间：', 1: '上次学习时间：', 2: '完成学习时间：', 4: '完成学习时间：' },
            btnText = { 0: '开始学习', 1: '继续学习', 2: '重新学习', 4: '重新学习' };
        _.map(progressList, function(opt) {
            var progress = opt,
                studyTotalTime = progress.studyTotalTime || 0;
            progress.imgUrl = progress.cover ? (downUrl + '?id=' + progress.cover) : defultImg;
            if (progress.finishStatus === 0) { // 推送学习时间取值为注册时间
                progress.prefixText = prefix[progress.finishStatus] + helpers.dateMinute(progress.registerTime);
            } else if (progress.finishStatus === 2 || progress.finishStatus === 4) {
                progress.prefixText = prefix[progress.finishStatus] + helpers.dateMinute(progress.finishTime);
            } else {
                progress.prefixText = prefix[progress.finishStatus] + helpers.dateMinute(progress.lastAccessTime);
            }
            progress.btnText = btnText[progress.finishStatus];
            progress.btnUrl = '#/study/course/detail/' + progress.courseId;
            if (search.businessType === 2) {
                progress.btnUrl = '#/study/subject/detail/' + progress.courseId;
            }
            progress.studyTotalTime = (Number(studyTotalTime) / 60).toFixed(1);
            return progress;
        });
        return progressList;
    }
};

exports.actions = {
    'click delete-*': 'deleteProgress'
};

exports.dataForActions = {
    deleteProgress: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '是否确定放弃该课程的学习?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    deleteProgress: function() {
        this.app.message.success('已成功放弃该课程!');
        this.module.dispatch('search', this.bindings.search.data);
    }
};
