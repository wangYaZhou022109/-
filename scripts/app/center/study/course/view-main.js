var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    progressList: true,
    img: false,
    search: false
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
            var progress = opt;
            progress.imgUrl = progress.cover ? (downUrl + '?id=' + progress.cover) : defultImg;
            progress.prefixText = prefix[progress.finishStatus] + helpers.dateMinute(progress.lastAccessTime);
            progress.btnText = btnText[progress.finishStatus];
            progress.btnUrl = '#/study/course/detail/' + progress.courseId;
            if (search.businessType === 2) {
                progress.btnUrl = '#/study/subject/detail/' + progress.courseId;
            }
            return progress;
        });
        return progressList;
    }
};
