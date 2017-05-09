var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    progressList: true,
    img: false,
    search: false
};
exports.events = {
    'click beginStudy-*': 'beginStudy'
};

exports.handlers = {
    beginStudy: function(id) {
        var progress = _.find(this.bindings.progressList.data, { id: id }),
            course = progress.courseInfo,
            studyUrl = '#/study/subject/detail/' + progress.courseId;
        if (course.url) {
            studyUrl = course.url;
            this.module.dispatch('register', { id: progress.courseId });
        }
        window.open(studyUrl);
    }
};


exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'progressList' }
}];

exports.dataForTemplate = {
    progressList: function(data) {
        var progressList = data.progressList,
            downUrl = this.bindings.img.getFullUrl(),
            defultImg = 'images/default-cover/default_spceial.jpg',
            prefix = { 0: '推送学习时间：', 1: '上次学习时间：', 2: '完成学习时间：', 4: '完成学习时间：' },
            btnText = { 0: '开始学习' };
        _.map(progressList, function(opt) {
            var progress = opt,
                course = progress.courseInfo || {},
                studyTotalTime = progress.studyTotalTime || 0;
            progress.imgUrl = course.cover ? (downUrl + '?id=' + course.cover) : defultImg;
            if (progress.finishStatus === 0) { // 推送学习时间取值为注册时间
                progress.prefixText = prefix[progress.finishStatus] + helpers.dateMinute(progress.registerTime);
            } else if (progress.finishStatus === 2 || progress.finishStatus === 4) {
                progress.prefixText = prefix[progress.finishStatus] + helpers.dateMinute(progress.finishTime);
            } else {
                progress.prefixText = prefix[progress.finishStatus] + helpers.dateMinute(progress.lastAccessTime);
            }
            progress.btnText = btnText[progress.finishStatus] || '查看详情';
            progress.btnUrl = '#/study/subject/detail/' + progress.courseId;
            if (course.url) progress.btnUrl = course.url;
            progress.studyTotalTime = window.parseInt(Number(studyTotalTime) / 60);
            return progress;
        });
        return progressList;
    }
};
